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
fn apply_translation(zip_path: &str, release_tag: &str) -> Result<String, String> {
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

    let version_path = plutonium_dir.join(".t6-version");
    fs::write(&version_path, release_tag).map_err(|e| format!("Erro ao salvar versão: {}", e))?;

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

    let version_path = plutonium_dir.join(".t6-version");
    if version_path.exists() {
        fs::remove_file(&version_path).ok();
    }

    Ok(format!("{} arquivo(s) .str removido(s)", removed))
}

async fn download_plutonium_exe() -> Result<PathBuf, String> {
    let temp_dir = std::env::temp_dir().join("t6-translation");
    fs::create_dir_all(&temp_dir).map_err(|e| format!("Erro ao criar diretório: {}", e))?;

    let exe_path = temp_dir.join("plutonium.exe");

    // Se já baixou, usar o arquivo existente
    if exe_path.exists() {
        return Ok(exe_path);
    }

    // Tentar encontrar plutonium.exe localmente
    let local = env::var("LOCALAPPDATA").unwrap_or_default();
    let local_exe = PathBuf::from(local).join("Plutonium").join("bin").join("plutonium.exe");

    if local_exe.exists() {
        return Ok(local_exe);
    }

    // Baixar do CDN
    let response = reqwest::get("https://cdn.plutonium.pw/updater/plutonium.exe")
        .await
        .map_err(|e| format!("Falha ao baixar plutonium.exe: {}", e))?;

    if !response.status().is_success() {
        return Err(format!("Falha ao baixar: HTTP {}", response.status()));
    }

    let bytes = response.bytes().await
        .map_err(|e| format!("Falha ao ler resposta: {}", e))?;

    let mut file = fs::File::create(&exe_path)
        .map_err(|e| format!("Erro ao criar arquivo: {}", e))?;
    file.write_all(&bytes)
        .map_err(|e| format!("Erro ao salvar: {}", e))?;

    Ok(exe_path)
}


#[tauri::command]
async fn steam_fix_install(bo2_path: &str) -> Result<String, String> {
    let bo2_dir = PathBuf::from(bo2_path);
    let backup_dir = bo2_dir.join(".plutonium_backup");

    // Criar diretório de backup
    fs::create_dir_all(&backup_dir)
        .map_err(|e| format!("Erro ao criar diretório de backup: {}", e))?;

    // Baixar/copiar plutonium.exe
    let plutonium_exe = download_plutonium_exe()
        .await
        .map_err(|e| format!("Erro ao obter plutonium.exe: {}", e))?;

    // Executáveis a substituir
    let exes = vec!["t6mp.exe", "t6sp.exe", "t6zm.exe"];
    let mut backed_up = 0;

    for exe_name in &exes {
        let exe_path = bo2_dir.join(exe_name);

        // Se arquivo original existe, fazer backup
        if exe_path.exists() {
            let backup_path = backup_dir.join(exe_name);
            if !backup_path.exists() {
                fs::copy(&exe_path, &backup_path)
                    .map_err(|e| format!("Erro ao fazer backup de {}: {}", exe_name, e))?;
                backed_up += 1;
            }

            // Substituir pelo plutonium.exe
            fs::copy(&plutonium_exe, &exe_path)
                .map_err(|e| format!("Erro ao copiar plutonium.exe para {}: {}", exe_name, e))?;
        }
    }

    Ok(format!(
        "✅ Plutonium Steam Fix instalado!\n\
         \n\
         📁 Backup criado em:\n\
         {}\n\
         \n\
         ✓ {} executável(is) substituído(s):\n\
         • t6mp.exe (Multiplayer)\n\
         • t6sp.exe (Single Player)\n\
         • t6zm.exe (Zombies)\n\
         \n\
         Agora ao clicar em \"Play\" no Steam, rodará Plutonium!",
        backup_dir.display(),
        backed_up,
    ))
}

#[tauri::command]
fn check_path(path: &str) -> bool {
    Path::new(path).exists()
}

#[tauri::command]
fn steam_fix_uninstall(bo2_path: &str) -> Result<String, String> {
    let bo2_dir = PathBuf::from(bo2_path);
    let backup_dir = bo2_dir.join(".plutonium_backup");

    if !backup_dir.exists() {
        return Err("Nenhum backup encontrado. Verifique se o Steam Fix foi instalado corretamente.".to_string());
    }

    let exes = vec!["t6mp.exe", "t6sp.exe", "t6zm.exe"];
    let mut restored = 0;

    for exe_name in &exes {
        let exe_path = bo2_dir.join(exe_name);
        let backup_path = backup_dir.join(exe_name);

        if backup_path.exists() {
            fs::copy(&backup_path, &exe_path)
                .map_err(|e| format!("Erro ao restaurar {}: {}", exe_name, e))?;
            restored += 1;
        }
    }

    // Remover diretório de backup
    fs::remove_dir_all(&backup_dir)
        .map_err(|e| format!("Erro ao remover backup: {}", e))?;

    Ok(format!(
        "✅ Plutonium Steam Fix removido!\n\
         \n\
         ✓ {} executável(is) restaurado(s):\n\
         • t6mp.exe\n\
         • t6sp.exe\n\
         • t6zm.exe\n\
         \n\
         Agora o jogo rodará com o executável original!",
        restored,
    ))
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

#[tauri::command]
fn check_translation_status() -> Result<serde_json::Value, String> {
    let plutonium_dir = get_plutonium_strings_dir()?;

    let installed = plutonium_dir.exists();
    let mut file_count = 0;
    let mut version = String::new();

    if installed {
        if let Ok(entries) = fs::read_dir(&plutonium_dir) {
            file_count = entries
                .flatten()
                .filter(|e| e.path().extension().map_or(false, |ext| ext == "str"))
                .count() as u32;
        }

        let version_path = plutonium_dir.join(".t6-version");
        if version_path.exists() {
            version = fs::read_to_string(&version_path).unwrap_or_default();
        }
    }

    Ok(serde_json::json!({
        "installed": installed,
        "file_count": file_count,
        "path": plutonium_dir.to_string_lossy().to_string(),
        "version": version,
    }))
}

#[tauri::command]
fn check_steam_fix_status(bo2_path: &str) -> Result<bool, String> {
    let bo2_dir = PathBuf::from(bo2_path);
    let backup_dir = bo2_dir.join(".plutonium_backup");

    // Steam Fix está instalado se o diretório de backup existe
    Ok(backup_dir.exists())
}

#[tauri::command]
async fn check_launcher_update(app: tauri::AppHandle) -> Result<serde_json::Value, String> {
    let current = app.package_info().version.to_string();
    let current_tag = format!("v{}", current);

    let url = "https://api.github.com/repos/edgarcsr/t6-translation-ptbr/releases/latest";
    let client = reqwest::Client::builder()
        .user_agent("t6-translation-ptbr")
        .build()
        .map_err(|e| format!("Erro ao criar cliente HTTP: {}", e))?;

    let response = client
        .get(url)
        .send()
        .await
        .map_err(|e| format!("Falha ao verificar atualização: {}", e))?;

    if !response.status().is_success() {
        return Ok(serde_json::json!({
            "current": current_tag,
            "latest": null,
            "update_available": false,
        }));
    }

    let data: serde_json::Value = response
        .json()
        .await
        .map_err(|e| format!("Erro ao parsear resposta: {}", e))?;

    let latest = data["tag_name"].as_str().unwrap_or("").to_string();
    let update_available = !latest.is_empty() && latest != current_tag;

    Ok(serde_json::json!({
        "current": current_tag,
        "latest": latest,
        "update_available": update_available,
    }))
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_dialog::init())
        .invoke_handler(tauri::generate_handler![
            download_translation,
            apply_translation,
            remove_translation,
            check_translation_status,
            check_path,
            check_steam_fix_status,
            steam_fix_install,
            steam_fix_uninstall,
            check_launcher_update,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
