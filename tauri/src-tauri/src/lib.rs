use std::path::{Path, PathBuf};
use std::fs;
use std::io::Write;

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

#[tauri::command]
fn steam_fix_install(bo2_path: &str) -> Result<String, String> {
    let bat_path = PathBuf::from(bo2_path).join("Plutonium_BO2.bat");
    let plutonium_exe = PathBuf::from(bo2_path)
        .join("plutonium.exe");

    let content = format!(
        "@echo off\n\
         start \"\" \"{}\" -procname bo2\n\
         exit\n",
        plutonium_exe.display()
    );

    let mut file = fs::File::create(&bat_path).map_err(|e| format!("Erro ao criar script: {}", e))?;
    file.write_all(content.as_bytes()).map_err(|e| format!("Erro ao escrever script: {}", e))?;

    Ok(format!("Script criado: {}", bat_path.display()))
}

#[tauri::command]
fn steam_fix_uninstall(bo2_path: &str) -> Result<String, String> {
    let bat_path = PathBuf::from(bo2_path).join("Plutonium_BO2.bat");

    if bat_path.exists() {
        fs::remove_file(&bat_path).map_err(|e| format!("Erro ao remover script: {}", e))?;
        Ok("Script removido".to_string())
    } else {
        Ok("Nenhum script encontrado".to_string())
    }
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
