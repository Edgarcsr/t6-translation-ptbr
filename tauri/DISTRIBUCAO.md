# 📦 Guia Completo de Distribuição da Tradução

Fluxo ponta a ponta: preparar release → publicar no GitHub → usuário baixa e aplica.

---

## 1️⃣ PREPARAR A RELEASE

### A. Estruturar os arquivos `.str`

Coloque todos os arquivos de tradução em:
```
translation/ptbr/localizedstrings/
├── ptbr_mp.str
├── ptbr_zm.str
├── ptbr_patch.str
└── ... outros arquivos .str
```

**Importante:**
- Todos os arquivos devem estar em UTF-8 com BOM
- Nomes devem seguir padrão: `ptbr_*.str`
- Cada arquivo máx ~11000 strings (não há limite quando em múltiplos arquivos)

### B. Testar localmente (antes de publicar)

Copie manualmente para `%LOCALAPPDATA%\Plutonium\storage\t6\raw\localizedstrings` e teste no jogo.

### C. Criar o ZIP

**Opção 1: Usar o script PowerShell**
```powershell
cd scripts
.\create-release.ps1 -Version "v1.0.0"
```

**Opção 2: Manual no PowerShell**
```powershell
$src = "translation/ptbr/localizedstrings"
$zip = "translation.zip"

Add-Type -AssemblyName System.IO.Compression.FileSystem
[System.IO.Compression.ZipFile]::CreateFromDirectory((Resolve-Path $src), (Resolve-Path $zip))
```

**Opção 3: Usando 7-Zip ou WinRAR**
- Clique direito em `translation/ptbr/localizedstrings/`
- "Send to" → "Compressed folder"
- Renomeie para `translation.zip`

### D. Versionar e Tag

```bash
git add translation/ptbr/localizedstrings/
git commit -m "feat: add translations for [description]"
git tag v1.0.0
git push origin main
git push origin v1.0.0
```

---

## 2️⃣ PUBLICAR NO GITHUB

### Opção A: Usando GitHub CLI (`gh`)

```bash
gh release create v1.0.0 translation.zip --title "Release v1.0.0" --notes "Portuguese-BR translation for BO2"
```

### Opção B: Website do GitHub

1. Vá para: https://github.com/edgarcsr/t6-translation-ptbr/releases
2. Clique "Create a new release"
3. Selecione tag: `v1.0.0`
4. Arraste `translation.zip` na seção "Assets"
5. Publish release

### Resultado esperado

URL final será: `https://github.com/edgarcsr/t6-translation-ptbr/releases/download/v1.0.0/translation.zip`

---

## 3️⃣ USUÁRIO BAIXA E APLICA

### Usar a Translation Manager App

**Instalação:**
```bash
cd tauri
npm install
npm run tauri build
```

Executável gerado em: `src-tauri/target/release/t6-translation-manager.exe`

**Uso:**
1. Abra a app
2. Verifique valores padrão:
   - Owner: `edgarcsr`
   - Repository: `t6-translation-ptbr`
   - Release Tag: `v1.0.0`
3. Clique **"📥 Baixar Tradução"** → downloads automaticamente
4. Clique **"📂 Aplicar Tradução"** → copia para Plutonium
5. Reinicie o Plutonium

**Ou via CLI (para poder customizar):**
```bash
cd tauri
npm run tauri dev
# Editar repoOwner/repoName/releaseTag conforme necessário
```

---

## 4️⃣ ESTRUTURA DO ZIP

O app espera encontrar arquivos `.str` em qualquer pasta dentro do ZIP:

```
translation.zip
├── ptbr_mp.str          ✅ Extraído
├── ptbr_zm.str          ✅ Extraído
├── ptbr_patch.str       ✅ Extraído
├── subpasta/            (opcional)
│   └── ptbr_other.str   ✅ Extraído
└── .DS_Store            ⚠️ Ignorado (não .str)
```

**Resultado:** Todos os `.str` são copiados para:
```
%LOCALAPPDATA%\Plutonium\storage\t6\raw\localizedstrings\
```

---

## 5️⃣ WORKFLOW RECOMENDADO

### Para releases pequenas (hotfix):
```bash
# 1. Edit translation files
# 2. Test locally
git add translation/ptbr/localizedstrings/
git commit -m "fix: tradução de [item]"

# 3. Package
./scripts/create-release.ps1 -Version "v1.0.1"

# 4. Publicar
gh release create v1.0.1 translation.zip
```

### Para releases grandes (feature):
```bash
# 1. Branch separado
git checkout -b feature/large-translation

# 2. Múltiplos commits
git add translation/ptbr/localizedstrings/menu.str
git commit -m "feat: menu translations"

git add translation/ptbr/localizedstrings/maps.str
git commit -m "feat: map translations"

# 3. Merge para main
git checkout main
git merge feature/large-translation

# 4. Tag e release
git tag v2.0.0
./scripts/create-release.ps1 -Version "v2.0.0"
gh release create v2.0.0 translation.zip
```

---

## 🎯 Checklist Pre-Release

- [ ] Todos os arquivos `.str` estão em UTF-8 com BOM
- [ ] Testou localmente no Plutonium (strings aparecem em PT-BR)
- [ ] Não há caracteres quebrados (é, ã, ç, õ rendendo corretamente)
- [ ] ZIP foi criado e contém os arquivos `.str`
- [ ] Git commits têm mensagens claras
- [ ] Tag criada: `v1.0.0` (ou versão desejada)
- [ ] Release publicada no GitHub
- [ ] URL do ZIP funciona no navegador

---

## ❌ Troubleshooting

### ZIP criado mas vazio
- Verifique caminho: `translation/ptbr/localizedstrings`
- Certifique-se que tem arquivos `.str` dentro
- Tente manualmente: `Add-Type -AssemblyName System.IO.Compression.FileSystem`

### App não consegue fazer download
- Verifique internet
- Confirme que Owner/Repo/Tag estão corretos
- Teste URL no navegador: `https://github.com/.../releases/download/.../translation.zip`

### Strings não aparecem no jogo
- Pasta Plutonium criada? `%LOCALAPPDATA%\Plutonium\storage\t6\raw\localizedstrings`
- Arquivos têm extensão `.str`? (maiúscula/minúscula importa no Linux, mas Windows é case-insensitive)
- Reiniciou o Plutonium?

---

## 📚 Referência Rápida

| Comando | O que faz |
|---------|-----------|
| `.\create-release.ps1 -Version v1.0.0` | Cria ZIP + commit + tag |
| `gh release create v1.0.0 translation.zip` | Publica no GitHub |
| `npm run tauri build` | Compila app para distribuir |
| `npm run tauri dev` | Testa app em desenvolvimento |

---

## 🚀 Próximos Passos

1. **Automatizar CI/CD** (opcional)
   - GitHub Actions para testar/compilar automaticamente
   - Auto-criar release quando tag é pushed

2. **Versão da App (auto-updater)**
   - Tauri tem plugin `tauri-plugin-updater`
   - App pode verificar updates automaticamente

3. **Atalho de Desktop**
   - Ao compilar, app cria `.exe` e atalhos no Start Menu
   - Usuários precisam apenas clicar para usar

---

*Última atualização: 2026-07-14*
