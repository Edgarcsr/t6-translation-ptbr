# OpenAssetTools (OAT) v0.31.0

**Source:** https://github.com/Laupetin/OpenAssetTools/
**Release:** https://github.com/Laupetin/OpenAssetTools/releases/tag/v0.31.0
**License:** GPL-3.0

## Contents

The OAT release is extracted into `oat-windows/`:

| File | Purpose |
|------|---------|
| `oat-windows/Unlinker.exe` | Extracts assets from `.ff` files |
| `oat-windows/Linker.exe` | Builds custom `.ff` files |
| `oat-windows/ImageConverter.exe` | Converts images for use in game |
| `oat-windows/raw/` | Reference raw asset templates (IW3-IW5, T5-T6) |

## Usage

The Go path-selector tool at `path-selector/` uses these binaries automatically. It detects the OAT path relative to its own location.

You can also run the tools directly:

```powershell
cd internal\tools\oat-windows
.\Unlinker.exe --search-path "C:\path\to\game\zone\english" "zone.ff"
.\Linker.exe --load "zone.ff" --zone-path "zone_source" --outdir "output" zonedef
```

## Changelog

| Version | Date | Notes |
|---------|------|-------|
| v0.31.0 | 2026 | Current version used by this project |
