param(
    [Parameter(Mandatory=$true)]
    [string]$GamePath,
    [Parameter(Mandatory=$false)]
    [string]$OatPath = "..\tools\oat-windows",
    [Parameter(Mandatory=$false)]
    [string]$ProjectRoot = "..\..",
    [Parameter(Mandatory=$false)]
    [string]$Locale = "brazilian"
)

$Linker = Join-Path $OatPath "Linker.exe"
$EnglishZone = Join-Path $GamePath "zone\english"
$PtbrZoneSource = Join-Path $ProjectRoot "translation\ptbr\zone_source"
$PtbrOutput = Join-Path $ProjectRoot "translation\ptbr\zone\$Locale"

if (-not (Test-Path $Linker)) {
    Write-Error "Linker not found at $Linker. Download OAT first."
    exit 1
}

# Ensure output directory exists
New-Item -ItemType Directory -Path $PtbrOutput -Force | Out-Null

$Zones = @(
    "common_mp",
    "common_zm",
    "code_post_gfx_mp",
    "code_post_gfx_zm",
    "ui_mp",
    "ui_zm",
    "patch_mp",
    "patch_zm",
    "patch_ui_mp",
    "patch_ui_zm"
)

foreach ($zone in $Zones) {
    $zoneFile = "$zone.ff"
    $zoneSourcePath = Join-Path $PtbrZoneSource "$zone.zone"
    $sourceZonePath = Join-Path $EnglishZone $zoneFile

    if (-not (Test-Path $sourceZonePath)) {
        Write-Warning "Source zone not found: $sourceZonePath. Skipping $zone."
        continue
    }

    if (-not (Test-Path $zoneSourcePath)) {
        Write-Warning "Zone source not found: $zoneSourcePath. Skipping $zone."
        continue
    }

    Write-Host "Building $zone..."

    & $Linker `
        --load $sourceZonePath `
        --asset-path "$ProjectRoot\translation\ptbr\zone_raw" `
        --zone-path $PtbrZoneSource `
        --outdir $PtbrOutput `
        --verbose `
        $zone
}

# Copy localization files to patch output
Copy-Item -Path "$ProjectRoot\translation\ptbr\localization*.txt" -Destination $PtbrOutput -Force

Write-Host "Done! Brazilian patch files are in $PtbrOutput"
