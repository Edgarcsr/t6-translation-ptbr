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

→ **Full docs:** `docs/TRANSLATION_WORKFLOW.md` | `docs/RAW_OVERRIDE_SYSTEM.md`

### Step 1: Extract Original Strings
```powershell
cd internal/tools/t6-translator
./t6-translator.exe  # [1] Extract
```
Output: `translation/source/zone_dump/` (original strings from game)

### Step 2: Translate Files
Copy to `translation/ptbr/localizedstrings/` and edit:

**Format:**
```
VERSION             "1"
CONFIG              "ptbr_translation"

REFERENCE           ZMUI_SOLO_PLAY_CAPS
LANG_ENGLISH        "JOGO SOLO"

REFERENCE           MENU_CUSTOM_GAMES
LANG_ENGLISH        "PARTIDAS PERSONALIZADAS"

ENDMARKER
```

**DO NOT change:**
- `REFERENCE` (it's the internal key)
- `VERSION`, `CONFIG`, `ENDMARKER`

### Step 3: Version Control
```powershell
git add translation/ptbr/localizedstrings/
git commit -m "feat: add PT-BR translations for patch_zm"
```

### Step 4: Deploy to Plutonium
```powershell
$src = "translation\ptbr\localizedstrings"
$dst = "$env:LOCALAPPDATA\Plutonium\storage\t6\raw\localizedstrings"
Copy-Item "$src\*.str" -Destination $dst -Force
```

### Step 5: Test in Game
- Restart Plutonium T6
- Strings load automatically
- No mod activation needed
- Profile/stats preserved

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
- **Accents:** ✅ Confirmed working — é, ã, ç, õ, ô, í, ó all render correctly in T6
- **Use proper PT-BR:** "opções" instead of "opcoes", "você" instead of "voce", etc.

---

## Reference: Felipe's Setup

Felipe used BOTH methods simultaneously:
1. **`mods/t6_ptbr_completo/`** — compiled mod with scripts & images
2. **`raw/localizedstrings/`** — 84 `.str` files with 45,000+ strings

But for translation-only (no custom scripts), **`raw/` alone is sufficient**.

---

## Next Steps

1. ✅ Raw folder created at `%localappdata%\Plutonium\storage\t6\raw\localizedstrings/`
2. ✅ Accents confirmed working (é, ã, ç, õ, ô, í, ó all render)
3. ✅ `en_patch_zm.str` translated (2308 strings)
4. ✅ `en_code_post_gfx_mp.str` + `en_code_post_gfx_zm.str` — "PARTIDAS PERSONALIZADAS" and "Opções" translated
5. ⏳ Translate remaining 80+ zone files

---

*Last updated: 2026-07-14*
