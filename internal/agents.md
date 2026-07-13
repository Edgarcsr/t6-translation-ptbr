# Black Ops II PT-BR Translation - Agents Guide

## Project Overview

Translate Call of Duty: Black Ops II (Plutonium T6) to Brazilian Portuguese.

**Target Platform:** Plutonium T6 (PC)
**Base Language:** English
**Target Language:** Brazilian Portuguese (pt-BR)
**Locale Code:** `brazilian`

---

## Tools

### OpenAssetTools (OAT)

**Repo:** https://github.com/Laupetin/OpenAssetTools
**Docs:** https://openassettools.dev/
**License:** GPL-3.0

OpenAssetTools is the primary tool for working with `.ff` (fastfile) files from BO2/T6.

It provides two main executables:

| Tool | Purpose |
|------|---------|
| `Unlinker.exe` | Extracts/dumps assets from `.ff` files to disk |
| `Linker.exe` | Builds custom `.ff` files from raw assets on disk |

**Supported T6 Asset Types relevant to localization:**

| Asset Type | Dump | Load | Purpose |
|-----------|------|------|---------|
| `LocalizeEntry` | ✅ | ✅ | Localization string key-value pairs |
| `StringTable` | ✅ | ✅ | CSV-like string tables |
| `Font_s` | ✅ | ✅ | Font definitions (needed for special chars) |
| `FontIcon` | ✅ | ✅ | Font icon mappings |
| `RawFile` | ✅ | ✅ | Raw text/script files |
| `KeyValuePairs` | ✅ | ✅ | Key-value configs |

**Current version used by this project:** [v0.31.0](https://github.com/Laupetin/OpenAssetTools/releases/tag/v0.31.0)
**Version info documented in:** `internal/tools/README.md`

### Getting OAT

**Option 1 - Download release (recommended):**
- https://github.com/Laupetin/OpenAssetTools/releases/tag/v0.31.0
- Download the Windows release zip (e.g. `OpenAssetTools-v0.31.0-Windows.zip`)
- Extract the zip contents into `internal/tools/oat-windows/` (so `Unlinker.exe` is at `internal/tools/oat-windows/Unlinker.exe`)

**Option 2 - Build from source (Windows):**
```powershell
# Requires: Visual Studio 2022, Git in PATH
# Clone (DO NOT download as zip - submodules needed)
git clone --recursive https://github.com/Laupetin/OpenAssetTools.git

# Generate VS solution
cd OpenAssetTools
.\generate.bat

# Open build/OpenAssetTools.sln in VS 2022 and build
# Or build from command line:
msbuild build\OpenAssetTools.sln /p:Configuration=Release

# Binaries go to: build\bin\Release_x86\
```

---

## Workflow: Extract → Translate → Build

### Step 1: Extract English Strings

Use the path-selector tool (recommended) to run Unlinker automatically:

```powershell
cd internal\tools\path-selector
.\path-selector.exe
# Select option [1] Extract
```

**OR** use `Unlinker` directly:

**NOTE:** Your BO2 Plutonium installation must be accessible. Typical paths:
- Plutonium: `%localappdata%\Plutonium\storage\t6\`
- Steam: `C:\Program Files (x86)\Steam\steamapps\common\Call of Duty Black Ops II\`

**Extract common zones (most localization strings):**
```powershell
# Set game path
$g = "$env:LOCALAPPDATA\Plutonium\storage\t6"
$o = "internal\tools\oat-windows"

# Unlink common_mp (multiplayer + shared strings)
& "$o\Unlinker.exe" --search-path "$g\zone\english" "$g\zone\english\common_mp.ff"

# Unlink common_zm (zombies strings)
& "$o\Unlinker.exe" --search-path "$g\zone\english" "$g\zone\english\common_zm.ff"

# Unlink UI zones
& "$o\Unlinker.exe" --search-path "$g\zone\english" "$g\zone\english\ui_mp.ff"
& "$o\Unlinker.exe" --search-path "$g\zone\english" "$g\zone\english\ui_zm.ff"

# Unlink code_post_gfx (menu strings)
& "$o\Unlinker.exe" --search-path "$g\zone\english" "$g\zone\english\code_post_gfx_mp.ff"
& "$o\Unlinker.exe" --search-path "$g\zone\english" "$g\zone\english\code_post_gfx_zm.ff"

# Unlink patches
& "$o\Unlinker.exe" --search-path "$g\zone\english" "$g\zone\english\patch_mp.ff"
& "$o\Unlinker.exe" --search-path "$g\zone\english" "$g\zone\english\patch_zm.ff"
& "$o\Unlinker.exe" --search-path "$g\zone\english" "$g\zone\english\patch_ui_mp.ff"
& "$o\Unlinker.exe" --search-path "$g\zone\english" "$g\zone\english\patch_ui_zm.ff"
```

After unlinking, a `zone_dump` folder is created containing:
- `zone_dump/zone_raw/` - Raw asset dumps (localize entries as CSV/text)
- `zone_dump/zone_source/` - Zone definition files
- `zone_dump/source_data/` - GDT files

**Move the dumped zone to your project:**
```powershell
# Copy zone_raw to project source
Copy-Item -Recurse zone_dump\zone_raw\* translation\source\zone_raw\

# Copy zone_source definitions
Copy-Item -Recurse zone_dump\zone_source\* translation\source\zone_source\
```

### Step 2: Generate Localization Files

The Italian example (`examples/Plutonium T6 - Patch IT/`) shows the expected structure:

```
Italian/
├── localization.txt           # Shared strings
├── localization_mp.txt        # Multiplayer-only strings
├── localization_zm.txt        # Zombies-only strings
├── zone/
│   └── italian/
│       ├── it_common_mp.ff
│       ├── it_common_zm.ff
│       ├── it_patch_mp.ff
│       ├── it_patch_zm.ff
│       ├── ... (all other zones)
│       └── it_base.ipak
├── sound/
│   ├── cmn_root.italian.sabs
│   ├── mpl_common.all.sabl
│   ├── mpl_common.all.sabs
│   └── ... (sound aliases)
```

The `localization*.txt` files use this format:
```
localization key
"translated text"

MENU_NEW_GAME
"Novo Jogo"

MENU_OPTIONS
"Opções"
```

The first line is the language name (e.g., `brazilian`).

**To extract localization keys from raw dumps:**
The `LocalizeEntry` assets dumped by Unlinker will be in a format like CSV or JSON under `zone_raw/`. From those, build the three localization files.

### Step 3: Create Zone Definitions

Create zone source files for the Brazilian Portuguese locale at `translation/ptbr/zone_source/`.

Each `.zone` file defines what assets go into a `.ff` file. Example for `common_mp`:

```c
// common_mp.zone
name common_mp
type map
assets
{
    // Reference all LocalizeEntry assets from the original zone
    // and include the translated ones
    LocalizeEntry,LOCALIZE_MENU_NEW_GAME
    LocalizeEntry,LOCALIZE_MENU_OPTIONS
    ...
}
```

### Step 4: Build Custom .ff Files

Use the path-selector tool (recommended):

```powershell
cd internal\tools\path-selector
.\path-selector.exe
# Select option [2] Build
```

**OR** use `Linker` directly:

```powershell
# For each zone, run Linker:
$o = "internal\tools\oat-windows"
$g = "$env:LOCALAPPDATA\Plutonium\storage\t6"

& "$o\Linker.exe" `
    --load "$g\zone\english\common_mp.ff" `
    --asset-path "translation\ptbr\zone_raw" `
    --zone-path "translation\ptbr\zone_source" `
    --outdir "translation\ptbr\zone\brazilian" `
    common_mp
```

### Step 5: Assemble the Patch

The final patch structure goes in `translation/ptbr/` and should mirror the Italian example:

```
ptbr/
├── localization.txt           # All shared PT-BR strings
├── localization_mp.txt        # MP-specific PT-BR strings
├── localization_zm.txt        # ZM-specific PT-BR strings
├── zone/
│   └── brazilian/
│       ├── br_common_mp.ff
│       ├── br_common_zm.ff
│       ├── br_code_post_gfx_mp.ff
│       ├── br_code_post_gfx_zm.ff
│       ├── br_patch_mp.ff
│       ├── br_patch_zm.ff
│       ├── br_patch_ui_mp.ff
│       ├── br_patch_ui_zm.ff
│       ├── br_ui_mp.ff
│       ├── br_ui_zm.ff
│       ├── br_mp_*.ff          # MP maps
│       ├── br_zm_*.ff          # ZM maps
│       ├── br_faction_*.ff     # Faction files
│       ├── br_dlc*.ff          # DLC load screens
│       ├── br_base.ipak        # Base IPAK
│       └── br_so_*.ff          # Survival-related zones
├── sound/
│   ├── cmn_root.brazilian.sabs
│   ├── cmn_root.all.sabl
│   ├── mpl_*.brazilian.sabs
│   └── mpl_*.all.sabl
```

---

## Character Support & Fonts

Since Portuguese uses the Latin alphabet with accented characters (á, à, â, ã, ç, é, ê, í, ó, ô, õ, ú), most characters `should` already be present in the English game fonts. However, if any characters show up as boxes or missing:

1. Extract the font files using Unlinker (asset type `Font_s`)
2. Modify the `gamefonts` image to include missing character glyphs
3. Repack using Linker

This is a known issue for non-Latin scripts (Arabic, Cyrillic, etc.) but Portuguese is likely well-supported already.

---

## File Format Reference

### localization*.txt format
```
<language_name>

<KEY_ONE>
"translated string one"

<KEY_TWO>
"translated string with
newlines preserved"
```

### Zone file format (.zone)
```
name <zone_name>
type map
assets
{
    <AssetType>,<AssetName>
}
```

### .ff (fastfile)
Proprietary Treyarch format. Use OAT Unlinker/Linker.
Contains compressed assets referenced by the game engine.

### .iwd (IW Asset Package)
ZIP-based format. Can be opened with any ZIP tool.
Contains images, sounds, scripts, etc. for modding.

---

## Architecture: How BO2 Loads Languages

BO2 on Plutonium supports multiple languages. The language is typically set in `plutonium.ini` or the launcher.

The game loads:
1. `zone/<language>/` - Language-specific fastfiles
2. `localization*.txt` - String overrides (checked at runtime by Plutonium)
3. Sound banks from `sound/` folder

The Italian patch works because Plutonium checks for localized files. For PT-BR, we create a `brazilian` locale folder with translated `.ff` files and `localization*.txt` overrides.

---

## Scripts

### `internal/scripts/extract-all.ps1`
Extracts all English .ff files from the game to `translation/source/`.

### `internal/scripts/build-patch.ps1`
Builds all Brazilian .ff files from translated assets and assembles the final patch in `translation/ptbr/`.

---

## Path Selector Tool (Go)

**Source:** `internal/tools/path-selector/main.go`
**Binary:** `internal/tools/path-selector/path-selector.exe`

A Go-based interactive CLI that replaces the raw PowerShell scripts. Handles paths with spaces correctly.

### Features
- **Auto-detects** BO2 installation in common locations (Steam, Plutonium)
- **Interactive menu** (Extract, Build, Change path, Exit)
- **Proper quoting** for paths with spaces
- **Persists** game path to `gamepath.txt` (gitignored)

### How to use
```powershell
cd internal\tools\path-selector
.\path-selector.exe
```

### How to rebuild (requires Go)
```powershell
cd internal\tools\path-selector
go build -o path-selector.exe .
```

### Menu options
| Option | Action |
|--------|--------|
| `1` | Extract all `.ff` files via Unlinker |
| `2` | Build all `.ff` files via Linker |
| `3` | Change game path |
| `4` | Exit |

---

## Resources & Links

- **OpenAssetTools:** https://github.com/Laupetin/OpenAssetTools
- **OAT Documentation:** https://openassettools.dev/
- **Plutonium Forums - Translation Topic:** https://forum.plutonium.pw/topic/41558/
- **OAT Examples Repo:** https://github.com/OpenAssetTools/Examples
- **JezuzLizard t6-fastfile-mods:** https://github.com/JezuzLizard/t6-fastfile-mods
- **Italian Translation Example:** `examples/Plutonium T6 - Patch IT/`
