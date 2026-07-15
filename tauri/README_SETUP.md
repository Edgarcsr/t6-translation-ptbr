# Translation Manager - Tauri App

Aplicação desktop para:
1. 📥 Baixar tradução PT-BR do BO2 (via GitHub release)
2. 📂 Aplicar tradução no Plutonium
3. 🎮 Configurar Steam para rodar Plutonium ao invés do BO2 original

## 🚀 Configuração e Build

### Pré-requisitos
- Node.js 16+
- Rust (para build)
- Git

### Instalação

```bash
cd tauri
npm install
```

### Desenvolvimento

```bash
npm run tauri dev
```

Isso vai iniciar o servidor de desenvolvimento e abrir a janela do app.

### Build para Produção

```bash
npm run tauri build
```

O executável será gerado em `src-tauri/target/release/`.

---

## 📋 Como Usar

### 1. **Preparar a Release no GitHub**

Seu repositório precisa ter um arquivo `translation.zip` na release:

```bash
cd translation/ptbr/localizedstrings
zip -r ../../translation.zip *.str
git tag v1.0.0
git push origin v1.0.0
gh release create v1.0.0 translation.zip
```

### 2. **Usar a App**

1. Abra a aplicação (App.exe ou `npm run tauri dev`)
2. Configure os valores padrão (se necessário):
   - **Owner**: seu usuário GitHub (padrão: `edgarcsr`)
   - **Repositório**: nome do repo (padrão: `t6-translation-ptbr`)
   - **Tag da Release**: versão (padrão: `v1.0.0`)

3. Clique em **📥 Baixar Tradução**
   - Vai fazer download do `translation.zip` de `github.com/{owner}/{repo}/releases/download/{tag}/translation.zip`
   - Salva em `%TEMP%\t6-translation\translation.zip`

4. Clique em **📂 Aplicar Tradução**
   - Descompacta o ZIP
   - Copia todos os arquivos `.str` para `%LOCALAPPDATA%\Plutonium\storage\t6\raw\localizedstrings`

5. Reinicie o Plutonium — as strings carregam automaticamente!

---

## 🎮 Steam Fix - Rodar Plutonium pelo Steam

O app pode configurar o Steam para rodar Plutonium ao invés do BO2 original:

1. Clique em **"Instalar Steam Fix"**
2. App faz backup dos executáveis originais
3. Substitui `t6mp.exe`, `t6sp.exe`, `t6zm.exe` por `plutonium.exe`
4. Ao clicar "Play" no Steam → Roda Plutonium!

**Desinstalar:**
- Clique em **"Desinstalar Steam Fix"**
- Restaura executáveis originais automaticamente

> 📖 **Leia:** [STEAM_FIX_EVOLUTION.md](./STEAM_FIX_EVOLUTION.md) para entender a estratégia

---

## 🔧 Funções Backend (Rust)

### `download_translation(repo_owner, repo_name, release_tag)`

Baixa o ZIP da release especificada no GitHub.

**Retorna:** Caminho local do arquivo ZIP  
**Erro:** Se a URL retornar erro HTTP ou falhar na escrita

### `apply_translation(zip_path)`

Descompacta o ZIP e copia arquivos `.str` para a pasta do Plutonium.

**Retorna:** Mensagem confirmando o diretório  
**Erro:** Se ZIP inválido ou sem permissão de escrita

### `steam_fix_install(bo2_path)`

Faz backup dos executáveis e substitui por `plutonium.exe`.

**Retorna:** Mensagem de sucesso com detalhes do backup  
**Erro:** Se não conseguir copiar arquivos

### `steam_fix_uninstall(bo2_path)`

Restaura executáveis originais do backup.

**Retorna:** Mensagem de sucesso  
**Erro:** Se backup não existir

---

## 📁 Estrutura do Projeto

```
tauri/
├── src/                    # Frontend (React/TypeScript)
│   ├── App.tsx            # Interface principal
│   ├── App.css            # Estilos
│   └── main.tsx
├── src-tauri/             # Backend (Rust)
│   ├── src/
│   │   ├── lib.rs         # Funções download_translation e apply_translation
│   │   └── main.rs
│   └── Cargo.toml         # Dependências (reqwest, tokio, zip)
├── vite.config.ts
└── package.json
```

---

## 🎯 Fluxo Completo

1. **Desenvolver tradução** → `translation/ptbr/localizedstrings/*.str`
2. **Versionar** → `git tag v1.0.0`
3. **Lançar no GitHub** → Release com `translation.zip`
4. **Usuário abre app** → Download + Apply automático
5. **Plutonium carrega** → Strings em PT-BR aparecem automaticamente

---

## 🐛 Troubleshooting

### "Plutonium não encontrado"
- Certifique-se que `%LOCALAPPDATA%\Plutonium\storage\t6\` existe
- Se não existir, crie a pasta manualmente

### "ZIP inválido"
- Verifique se `translation.zip` contém arquivos `.str`
- Estrutura esperada: qualquer caminho dentro do ZIP com `.str` files

### "Erro de permissão"
- Certifique-se que você tem permissão de escrita em `%LOCALAPPDATA%\Plutonium\storage\t6\raw\localizedstrings`

---

*Desenvolvido com Tauri + React + Rust*
