# BO2 PT-BR Translation — Workflow & Constraints

## Overview
Fan-made Portuguese-BR translation for Call of Duty: Black Ops II (T6) on Plutonium.
**Main constraint:** Plutonium has a hard limit of ~10,852 string entries per mod before triggering `g_copyInfo exceeded` error.

---

## Two Distribution Methods

### 1. **MOD Method** (Compiled `.sabl`)
- **Path:** `%localappdata%\Plutonium\storage\t6\mods\<name>/`
- **Files:** `mod.json` + `mod.all.sabl` (binary, compiled)
- **Loading:** Must activate in Plutonium menu → separate save profile
- **Limitation:** ⚠️ **~10,852 max strings per single mod** — hits `g_copyInfo exceeded` above this
- **Status:** Works but limited; full translation impossible in one mod

### 2. **RAW Method** (Loose `.str` files) ✅ **PREFERRED**
- **Path:** `%localappdata%\Plutonium\storage\t6\raw\localizedstrings/`
- **Files:** Plain text `.str` files (one per zone/map)
- **Loading:** Automatic on game start — no activation needed
- **Limitation:** ✅ **NO limit** — each `.str` file loads independently
- **Status:** Unlimited strings, automatic loading, easy to edit

---

## RAW Method — Why It Works

Unlike compiled mods (single `.sabl` file with all strings), the `raw/` folder has **multiple `.str` files loaded independently**:

```
raw/localizedstrings/
├── en_code_post_gfx_mp.str    (11,300 strings) ✅ works
├── en_code_post_gfx_zm.str    (8,740 strings)  ✅ works
├── en_patch.str               (9,731 strings)  ✅ works
├── en_afghanistan.str         (497 strings)    ✅ works
└── ptbr_strings.str           (your overrides) ✅ works
```

Each file is processed separately, so no single file hits the 10,852 limit.
**Result:** Can load 45,000+ total strings across multiple files.

---

## Recommended Workflow

### Step 1: Create Override File
Edit: `%localappdata%\Plutonium\storage\t6\raw\localizedstrings\ptbr_strings.str`

Format:
```
VERSION             "1"
CONFIG              "ptbr_translation"
FILENOTES           "PT-BR override strings"

REFERENCE           ZMUI_SOLO_PLAY_CAPS
LANG_ENGLISH        "JOGO SOLO"

REFERENCE           MENU_CUSTOM_GAMES
LANG_ENGLISH        "PARTIDAS PERSONALIZADAS"

ENDMARKER
```

### Step 2: Test in Game
- No compilation needed
- No mod activation needed
- Just restart the game → strings load automatically

### Step 3: Version Control
Store source files in repo:
```
translation/ptbr/zone_raw/english/localizedstrings/
└── ptbr_strings.str
```

Commit regularly so nothing is lost.

---

## Why NOT Use the MOD Method

- Requires compilation (`Linker.exe`)
- Limited to ~10,852 strings per mod
- Requires activation in menu
- Creates separate save profile (stats reset)
- Overkill for this use case

---

## Character Encoding
- **Use:** UTF-8 with BOM
- **Avoid:** Accents if possible (é, ã, ç) — T6's font may not render them
- **Preferred:** "esta" instead of "está", "voce" instead of "você"

---

## Reference: Felipe's Setup

Felipe used BOTH methods simultaneously:
1. **`mods/t6_ptbr_completo/`** — compiled mod with scripts & images
2. **`raw/localizedstrings/`** — 84 `.str` files with 45,000+ strings

But for translation-only (no custom scripts), **`raw/` alone is sufficient**.

---

## Next Steps

1. ✅ Raw folder created at `%localappdata%\Plutonium\storage\t6\raw\localizedstrings/`
2. ⏳ Add strings to `ptbr_strings.str` as you translate
3. ⏳ Version control: commit to `translation/ptbr/zone_raw/`
4. ⏳ Test in-game after each major batch

---

*Last updated: 2026-07-14*
