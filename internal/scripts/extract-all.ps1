param(
    [Parameter(Mandatory=$true)]
    [string]$GamePath,
    [Parameter(Mandatory=$false)]
    [string]$OatPath = "..\tools\oat-windows",
    [Parameter(Mandatory=$false)]
    [string]$OutDir = "..\..\translation\source"
)

$Unlinker = Join-Path $OatPath "Unlinker.exe"
$EnglishZone = Join-Path $GamePath "zone\english"

if (-not (Test-Path $Unlinker)) {
    Write-Error "Unlinker not found at $Unlinker. Download OAT first."
    exit 1
}

if (-not (Test-Path $EnglishZone)) {
    Write-Error "English zone folder not found at $EnglishZone. Check GamePath."
    exit 1
}

$Zones = @(
    "common_mp.ff",
    "common_zm.ff",
    "code_post_gfx_mp.ff",
    "code_post_gfx_zm.ff",
    "ui_mp.ff",
    "ui_zm.ff",
    "patch_mp.ff",
    "patch_zm.ff",
    "patch_ui_mp.ff",
    "patch_ui_zm.ff"
)

Push-Location $OutDir
try {
    foreach ($zone in $Zones) {
        $zonePath = Join-Path $EnglishZone $zone
        if (Test-Path $zonePath) {
            Write-Host "Extracting $zone..."
            & $Unlinker --search-path $EnglishZone $zonePath
        } else {
            Write-Warning "Zone not found: $zonePath"
        }
    }
} finally {
    Pop-Location
}

Write-Host "Done! Extracted zones are in $OutDir\zone_dump"
Write-Host "Move zone_raw contents to $OutDir\zone_raw for linking."
