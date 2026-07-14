# Translation Workflow — Extração, Tradução e Empacotamento

## 📋 Visão Geral

O fluxo de tradução segue estas etapas:

```
┌─────────────────┐     ┌──────────────────────┐     ┌──────────────────┐
│  Jogo Original  │     │   Extrair Strings    │     │    Traduzir      │
│  zone/english/  │────▶│ → translation/source │────▶│ (manual/Google)  │
│     *.ff        │     │   zone_dump/         │     │                  │
└─────────────────┘     └──────────────────────┘     └──────────────────┘
                                                               │
                                                               ▼
┌──────────────────────────────────────┐     ┌──────────────────────────┐
│  Copiar para Plutonium (RAW)          │◀────│  Salvar em translation/  │
│  %localappdata%\Plutonium\storage\   │     │  ptbr/zone_raw/          │
│  t6\raw\localizedstrings\            │     │                          │
└──────────────────────────────────────┘     └──────────────────────────┘
                │
                ▼
         ✅ Jogo Traduzido
```

---

## 🔧 Ferramenta: `t6-translator` (antes: `path-selector`)

**Rename Suggestion:** A ferramenta será renomeada de `path-selector` para **`t6-translator`**
- ✅ Claro: diz exatamente o que é
- ✅ Específico: não é ambíguo como "path-selector"
- ✅ Curto: fácil de lembrar

---

## Step 1: Extrair Strings do Jogo Original

### O que acontece:
- Percorre `zone/english/*.ff` do jogo (ou Steam/Plutonium automático)
- Roda `Unlinker.exe` internamente
- Despeja todos os `.str` em `translation/source/zone_dump/`

### Como fazer:
```powershell
cd internal/tools/t6-translator
./t6-translator.exe
```

Isso abre um menu interativo:
```
╔═════════════════════════════════╗
║  BO2 PT-BR Translation Tool     ║
╚═════════════════════════════════╝

Game location detected: C:\Games\plutonium

[1] Extract strings (Unlinker)
[2] Build translation (Linker)
[3] Exit
```

**Escolha [1] — Extract**

### Resultado:
```
translation/source/
└── zone_dump/
    ├── en_patch_zm.str       (~180 referências)
    ├── en_patch_mp.str       (~110 referências)
    ├── en_common.str         (~500 referências)
    ├── en_code_post_gfx_zm.str
    ├── en_code_post_gfx_mp.str
    └── ... (mais 80 arquivos)
```

---

## Step 2: Traduzir os Arquivos

### Estrutura do arquivo `.str`:

```
VERSION             "1"
CONFIG              "ptbr_translation"
FILENOTES           "PT-BR override strings"

REFERENCE           ZMUI_SOLO_PLAY_CAPS
LANG_ENGLISH        "SOLO PLAY"

REFERENCE           MENU_CUSTOM_GAMES
LANG_ENGLISH        "CUSTOM GAMES"

ENDMARKER
```

### Tradução:
Mude apenas o valor de `LANG_ENGLISH`, **nunca** altere `REFERENCE`:

```
VERSION             "1"
CONFIG              "ptbr_translation"
FILENOTES           "PT-BR override strings"

REFERENCE           ZMUI_SOLO_PLAY_CAPS
LANG_ENGLISH        "JOGO SOLO"          ← TRADUZIDO

REFERENCE           MENU_CUSTOM_GAMES
LANG_ENGLISH        "PARTIDAS PERSONALIZADAS"  ← TRADUZIDO

ENDMARKER
```

### Cuidados:
- ⚠️ **Caracteres acentuados:** Use "voce" em vez de "você", "esta" em vez de "está"
  - Razão: fonte do jogo pode não renderizar acentos
- ⚠️ **Comprimento:** Mantenha razoável (o jogo tem espaço limitado no menu)
- ⚠️ **Encoding:** Sempre **UTF-8 com BOM**
- ⚠️ **`REFERENCE` e `ENDMARKER`:** Nunca mexa nesses

### Ferramentas recomendadas:
- **VSCode** + Portuguese PT-BR spellcheck
- **Excel/LibreOffice** (menos recomendado; risco de corromper formato)
- **Google Translate** (começo; depois revisar manualmente)

---

## Step 3: Organizar Arquivos Traduzidos

### Copiar para `translation/ptbr/`:

Os arquivos traduzidos devem ficar em uma estrutura espelhada:

```
translation/ptbr/
└── zone_raw/
    ├── en_patch_zm.str         (traduzido)
    ├── en_patch_mp.str         (traduzido)
    ├── en_common.str           (traduzido)
    └── ... (outros arquivos traduzidos)
```

### Nomeação:
- **Não mude os nomes!** Devem ser idênticos aos originais (`en_patch_zm.str`, não `pt_patch_zm.str`)
- Razão: Plutonium procura por esses nomes específicos para fazer override

### Versão de controle:
Commit regulamente em `translation/ptbr/zone_raw/`:

```powershell
git add translation/ptbr/zone_raw/en_patch_zm.str
git add translation/ptbr/zone_raw/en_patch_mp.str
git commit -m "feat: add PT-BR menu translations for ZM and MP"
```

---

## Step 4: Copiar para Plutonium (RAW Method) ✅

### Local de destino:
```
%localappdata%\Plutonium\storage\t6\raw\localizedstrings\
```

### Como copiar:
1. **Manual:** Abrir gerenciador de arquivos, copiar de `translation/ptbr/zone_raw/` para `%localappdata%\Plutonium\...`
2. **Script PowerShell:**
   ```powershell
   $source = "translation\ptbr\zone_raw"
   $dest = "$env:LOCALAPPDATA\Plutonium\storage\t6\raw\localizedstrings"
   
   Copy-Item "$source\*.str" -Destination $dest -Force
   Write-Host "✅ Strings copied to Plutonium"
   ```

### Resultado no Plutonium:
```
%localappdata%\Plutonium\storage\t6\raw\localizedstrings\
├── en_patch_zm.str          ← SEU ARQUIVO TRADUZIDO (carregado)
├── en_patch_mp.str          ← SEU ARQUIVO TRADUZIDO (carregado)
├── en_common.str            ← ORIGINAL DO JOGO (sobrescrito pelo seu)
└── ...
```

---

## Step 5: Testar no Jogo

1. **Reiniciar Plutonium T6**
   - Plutonium recarrega automaticamente arquivos de `raw/localizedstrings/`

2. **Abrir um menu** (ex: Solo Play)
   - Deve aparecer em Português: "JOGO SOLO"
   - Se não funcionar → verificar encoding (UTF-8 com BOM)

3. **Problemas?**
   - Menu em inglês? → Arquivo não está em `raw/localizedstrings/`
   - Caracteres estranhos? → Encoding errado (use UTF-8 com BOM)
   - Game travou? → Remova o arquivo e teste novamente

---

## 📊 Resumo Visual

| Etapa | Arquivo | Local | Ação |
|-------|---------|-------|------|
| 1️⃣ **Extract** | `*.ff` original | `zone/english/` | `t6-translator.exe` [1] |
| 2️⃣ **Dump** | `*.str` extraído | `translation/source/zone_dump/` | Automático |
| 3️⃣ **Translate** | `en_patch_zm.str` | `translation/ptbr/zone_raw/` | Manual/Automático |
| 4️⃣ **Git** | Versão controlada | Repositório | `git commit` |
| 5️⃣ **Deploy** | Arquivo final | `%localappdata%\Plutonium\...` | Copy/Script |
| 6️⃣ **Test** | Jogo em PT-BR | Plutonium T6 | Manual |

---

## 🎯 Checklist Rápido

- [ ] Rodou `t6-translator.exe` com opção [1] Extract
- [ ] Arquivos `.str` originais em `translation/source/zone_dump/`
- [ ] Selecionou quais arquivos traduzir (recomendação: começar com `en_patch_zm.str`)
- [ ] Traduzidos apenas os valores de `LANG_ENGLISH`
- [ ] `REFERENCE` e `ENDMARKER` não foram mexidos
- [ ] Encoding UTF-8 com BOM (não ANSI, não UTF-8 sem BOM)
- [ ] Arquivos copiados para `%localappdata%\Plutonium\storage\t6\raw\localizedstrings\`
- [ ] Reiniciou Plutonium T6
- [ ] Testou um menu e viu a tradução funcionando ✅

---

## 🚀 Próximas Etapas (Futuro)

Se quiser usar o **MOD Method** (compilado + distribuível):
1. Adaptar arquivos `.zone` em `translation/ptbr/zone_source/`
2. Rodar `t6-translator.exe` [2] Build
3. Compilar `.ff` em `translation/ptbr/zone/`
4. Empacotar em mod com `mod.json`

Mas para tradução local, **RAW Method é suficiente e muito mais simples**.

---

**Última atualização:** 2026-07-14  
**Status:** ✅ Fluxo validado, documentação completa
