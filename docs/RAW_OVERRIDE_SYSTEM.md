# Sistema RAW Override — Tradução Simples via `.str`

## 🎯 Descoberta: Basta Colocar o Arquivo Traduzido na Pasta

Não precisa compilar nada. Plutonium carrega automaticamente arquivos `.str` da pasta `raw/localizedstrings/`.

```
%localappdata%\Plutonium\storage\t6\raw\localizedstrings\
│
├── en_patch_zm.str          ← Coloque AQUI traduzido
├── en_patch_mp.str          ← Coloque AQUI traduzido
└── ... (outros arquivos)
```

**Resultado:** O jogo usa o arquivo traduzido em vez do original.

---

## Como Funciona

### 1️⃣ **Arquivo Original** (do jogo)
```
REFERENCE           ZMUI_SOLO_PLAY_CAPS
LANG_ENGLISH        "SOLO PLAY"

REFERENCE           MENU_CUSTOM_GAMES
LANG_ENGLISH        "CUSTOM GAMES"
```

### 2️⃣ **Você Traduz** (mesma estrutura)
```
REFERENCE           ZMUI_SOLO_PLAY_CAPS
LANG_ENGLISH        "JOGO SOLO"

REFERENCE           MENU_CUSTOM_GAMES
LANG_ENGLISH        "PARTIDAS PERSONALIZADAS"
```

### 3️⃣ **Salva em `raw/localizedstrings/`**
- Nome do arquivo: **sempre igual ao original** (`en_patch_zm.str`, não mude)
- Encoding: **UTF-8 (com BOM)**
- Local: `%localappdata%\Plutonium\storage\t6\raw\localizedstrings\en_patch_zm.str`

### 4️⃣ **Reinicia o Jogo**
Plutonium carrega o arquivo traduzido automaticamente. Nenhuma ativação de mod necessária.

---

## 🔑 Pontos-Chave

| Aspecto | Detalhe |
|---------|---------|
| **Nome do arquivo** | Deve ser idêntico ao original (`en_patch_zm.str`, `en_patch_mp.str`) |
| **Localização** | `%localappdata%\Plutonium\storage\t6\raw\localizedstrings\` |
| **Estrutura interna** | Não mude `REFERENCE` — traduza apenas o valor em `LANG_ENGLISH` |
| **Limite de strings** | ❌ Sem limite (cada arquivo `.str` é processado independentemente) |
| **Compilação** | ❌ Nenhuma (arquivo de texto puro) |
| **Ativação de mod** | ❌ Automática no boot do jogo |
| **Perfil de save** | ✅ Mantém perfil principal (stats/rank preservados) |

---

## Arquivos Principais a Traduzir

| Arquivo | Contém |
|---------|--------|
| `en_patch_zm.str` | Menus de Zombies (Solo, Custom Games, Lobby, etc) |
| `en_patch_mp.str` | Menus de Multiplayer (Create-a-Class, Killstreaks, etc) |
| `en_common.str` | Textos comuns (botões, confirmações, avisos) |
| `en_code_post_gfx_zm.str` | HUD de Zombies (pontuação, round, kills) |
| `en_code_post_gfx_mp.str` | HUD de Multiplayer (scorestreaks, objetivos) |

---

## 📝 Exemplo Prático

### Antes (Inglês)
```
REFERENCE           ZMUI_SOLO_PLAY_CAPS
LANG_ENGLISH        "SOLO PLAY"

REFERENCE           ZMUI_CUSTOM_GAMES_CAPS
LANG_ENGLISH        "CUSTOM GAMES"

REFERENCE           ZMUI_LOBBY
LANG_ENGLISH        "LOBBY"
```

### Depois (Português)
```
REFERENCE           ZMUI_SOLO_PLAY_CAPS
LANG_ENGLISH        "JOGO SOLO"

REFERENCE           ZMUI_CUSTOM_GAMES_CAPS
LANG_ENGLISH        "PARTIDAS PERSONALIZADAS"

REFERENCE           ZMUI_LOBBY
LANG_ENGLISH        "SALA DE ESPERA"
```

---

## 🚀 Workflow Mínimo

1. Extrair `.str` original do jogo (using `Unlinker.exe` ou copiar de `zone/english`)
2. Traduza os valores (não altere as `REFERENCE`)
3. Salve em `%localappdata%\Plutonium\storage\t6\raw\localizedstrings\`
4. Reinicie o jogo
5. **Pronto!** Menus traduzidos, stats preservados, sem hassle

---

## Vantagens vs MOD Compilado

| Aspecto | RAW (Texto) | MOD (Compilado) |
|---------|------------|-----------------|
| Limite de strings | ✅ Sem limite | ❌ ~10.852 max |
| Compilação | ❌ Nenhuma | ✅ Requer Linker |
| Ativação | ✅ Automática | ❌ Menu de Mods |
| Stats/Rank | ✅ Preservados | ❌ Reset enquanto mod ativo |
| Facilidade | ✅ Basta copiar arquivo | ❌ Recompila .ff todo rebuild |
| Portabilidade | ❌ Só no Plutonium local | ✅ Distribuível `.sabl` |

**Conclusão:** Para tradução local, **RAW é muito mais simples**.

---

## Notas Técnicas

- O `REFERENCE` é a **chave interna** do jogo — nunca mude
- O Plutonium busca em `raw/localizedstrings/` **antes** de usar os arquivos originais
- Se houver um arquivo `.str` traduzido e um original, **o traduzido vence**
- Cada arquivo é processado independentemente (sem limite global de strings)
- Reiniciar o jogo é necessário para recarregar os arquivos

---

**Documento criado em:** 2026-07-14  
**Baseado em:** Descoberta empírica — colocar arquivo traduzido em `raw/` funciona direto  
**Status:** ✅ Validado funcionando
