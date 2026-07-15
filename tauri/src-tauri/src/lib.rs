use std::path::{Path, PathBuf};
use std::fs;
use std::io::Write;

use std::env;

#[tauri::command]
async fn download_translation(repo_owner: &str, repo_name: &str, release_tag: &str) -> Result<String, String> {
    let url = format!(
        "https://github.com/{}/{}/releases/download/{}/translation.zip",
        repo_owner, repo_name, release_tag
    );

    let response = reqwest::get(&url)
        .await
        .map_err(|e| format!("Falha ao baixar: {}", e))?;

    if !response.status().is_success() {
        return Err(format!("Erro HTTP: {}", response.status()));
    }

    let temp_dir = std::env::temp_dir().join("t6-translation");
    fs::create_dir_all(&temp_dir).map_err(|e| format!("Erro ao criar diretório: {}", e))?;

    let zip_path = temp_dir.join("translation.zip");
    let bytes = response.bytes().await.map_err(|e| format!("Erro ao ler resposta: {}", e))?;

    let mut file = fs::File::create(&zip_path).map_err(|e| format!("Erro ao criar arquivo: {}", e))?;
    file.write_all(&bytes).map_err(|e| format!("Erro ao escrever arquivo: {}", e))?;

    Ok(zip_path.to_string_lossy().to_string())
}

#[tauri::command]
fn apply_translation(zip_path: &str) -> Result<String, String> {
    let zip_file = fs::File::open(zip_path).map_err(|e| format!("Erro ao abrir ZIP: {}", e))?;
    let mut archive = zip::ZipArchive::new(zip_file).map_err(|e| format!("ZIP inválido: {}", e))?;

    let plutonium_dir = get_plutonium_strings_dir()?;
    fs::create_dir_all(&plutonium_dir).map_err(|e| format!("Erro ao criar diretório: {}", e))?;

    for i in 0..archive.len() {
        let mut file = archive.by_index(i).map_err(|e| format!("Erro ao ler ZIP: {}", e))?;

        if file.name().ends_with(".str") {
            let file_name = Path::new(file.name()).file_name().unwrap();
            let out_path = plutonium_dir.join(file_name);

            let mut out_file = fs::File::create(&out_path).map_err(|e| format!("Erro ao criar arquivo: {}", e))?;
            std::io::copy(&mut file, &mut out_file).map_err(|e| format!("Erro ao copiar arquivo: {}", e))?;
        }
    }

    Ok(format!("Tradução aplicada em: {}", plutonium_dir.display()))
}

#[tauri::command]
fn remove_translation() -> Result<String, String> {
    let plutonium_dir = get_plutonium_strings_dir()?;

    if !plutonium_dir.exists() {
        return Ok("Nenhuma tradução encontrada".to_string());
    }

    let mut removed = 0u32;
    for entry in fs::read_dir(&plutonium_dir).map_err(|e| format!("Erro ao ler diretório: {}", e))? {
        let entry = entry.map_err(|e| format!("Erro ao acessar entrada: {}", e))?;
        let path = entry.path();

        if path.extension().map_or(false, |ext| ext == "str") {
            fs::remove_file(&path).map_err(|e| format!("Erro ao remover {}: {}", path.display(), e))?;
            removed += 1;
        }
    }

    Ok(format!("{} arquivo(s) .str removido(s)", removed))
}

const BO2_APPID: &str = "202970";
const STEAM_LAUNCH_OPTION: &str = "-procname bo2";

fn find_steam_config(bo2_path: &str) -> Option<PathBuf> {
    let p = Path::new(bo2_path);
    // BO2 path: .../steamapps/common/Call of Duty Black Ops II
    let steam = p.parent()?.parent()?.parent()?.parent()?;
    Some(steam.join("config").join("localconfig.vdf"))
}

fn update_steam_config(bo2_path: &str, add: bool) -> Result<(), String> {
    let config_path = match find_steam_config(bo2_path) {
        Some(p) if p.exists() => p,
        _ => return Ok(()),
    };

    let content = fs::read_to_string(&config_path)
        .map_err(|e| format!("Erro ao ler config Steam: {}", e))?;

    let option_key = "\"LaunchOptions\"";
    let option_val = format!("\"LaunchOptions\"\t\t\"{}\"", STEAM_LAUNCH_OPTION);
    let bo2_tag = format!("\"{}\"", BO2_APPID);

    if add {
        // Check if already set
        if content.contains(&option_val) {
            return Ok(());
        }
        // Check if different LaunchOptions exists for BO2
        if content.contains(&bo2_tag) && content.contains(option_key) {
            // A LaunchOptions already exists - check if it's ours or replace it
            // We'll skip this for now to avoid breaking existing config
            return Err("Já existe uma opção de inicialização configurada para BO2 no Steam.\n\
                       Remova manualmente em Propriedades > Opções de Inicialização e tente novamente.".to_string());
        }
    }

    let mut modified = false;
    let mut result = String::new();
    let mut in_bo2 = false;
    let mut depth: i32 = 0;
    let mut inserted = false;

    for line in content.lines() {
        let trimmed = line.trim();

        if trimmed == bo2_tag {
            in_bo2 = true;
        }

        if add && in_bo2 && !inserted && trimmed == "\"}" && depth == 0 && in_bo2 {
            // End of BO2 section, insert before closing
            result.push_str(&format!("\t\t{}\r\n", option_val));
            inserted = true;
            modified = true;
        }

        if !add && in_bo2 && trimmed.contains(option_key) {
            modified = true;
            continue; // skip this line
        }

        result.push_str(line);
        result.push_str("\r\n");

        if trimmed == "\"{" {
            depth += 1;
        }
        if trimmed == "\"}" {
            depth -= 1;
            if depth < 0 && in_bo2 {
                in_bo2 = false;
                depth = 0;
            }
        }
    }

    if modified {
        let backup = config_path.with_extension("vdf.backup");
        if !backup.exists() {
            fs::copy(&config_path, &backup).ok();
        }
        fs::write(&config_path, result.trim_end())
            .map_err(|e| format!("Erro ao salvar config Steam: {}", e))?;
    }

    Ok(())
}

#[tauri::command]
async fn steam_fix_install(bo2_path: &str) -> Result<String, String> {
    let bo2_dir = PathBuf::from(bo2_path);
    let dest = bo2_dir.join("plutonium.exe");

    if !dest.exists() {
        // Try local Plutonium installation first
        let local = env::var("LOCALAPPDATA").unwrap_or_default();
        let local_exe = PathBuf::from(local).join("Plutonium").join("bin").join("plutonium.exe");

        if local_exe.exists() {
            fs::copy(&local_exe, &dest)
                .map_err(|e| format!("Erro ao copiar plutonium.exe: {}", e))?;
        } else {
            // Download from CDN
            let response = reqwest::get("https://cdn.plutonium.pw/updater/plutonium.exe")
                .await
                .map_err(|e| format!("Falha ao baixar plutonium.exe: {}", e))?;

            if !response.status().is_success() {
                return Err(format!("Falha ao baixar: HTTP {}", response.status()));
            }

            let bytes = response.bytes().await
                .map_err(|e| format!("Falha ao ler resposta: {}", e))?;

            let mut file = fs::File::create(&dest)
                .map_err(|e| format!("Erro ao criar arquivo: {}", e))?;
            file.write_all(&bytes)
                .map_err(|e| format!("Erro ao salvar: {}", e))?;
        }
    }

    update_steam_config(bo2_path, true)?;

    Ok(format!(
        "Steam Fix instalado!\n\
         plutonium.exe em: {}\n\
         Opção de inicialização adicionada no Steam:\n\
         {}",
        dest.display(),
        STEAM_LAUNCH_OPTION,
    ))
}

#[tauri::command]
fn steam_fix_uninstall(bo2_path: &str) -> Result<String, String> {
    let bo2_dir = PathBuf::from(bo2_path);
    let exe_path = bo2_dir.join("plutonium.exe");
    if exe_path.exists() {
        fs::remove_file(&exe_path)
            .map_err(|e| format!("Erro ao remover plutonium.exe: {}", e))?;
    }

    update_steam_config(bo2_path, false)?;

    Ok("Steam Fix removido".to_string())
}

fn get_plutonium_strings_dir() -> Result<PathBuf, String> {
    let localappdata = std::env::var("LOCALAPPDATA").map_err(|_| "LOCALAPPDATA não encontrado".to_string())?;
    let path = PathBuf::from(localappdata)
        .join("Plutonium")
        .join("storage")
        .join("t6")
        .join("raw")
        .join("localizedstrings");

    Ok(path)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            download_translation,
            apply_translation,
            remove_translation,
            steam_fix_install,
            steam_fix_uninstall,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
