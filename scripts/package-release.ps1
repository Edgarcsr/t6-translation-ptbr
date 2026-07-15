param(
  [string]$SourceDir = "translation\ptbr\localizedstrings",
  [string]$OutputDir = "dist",
  [string]$ZipName = "translation.zip"
)

$ErrorActionPreference = "Stop"

if (!(Test-Path -LiteralPath $SourceDir)) {
  Write-Error "Diretório não encontrado: $SourceDir"
  exit 1
}

if (!(Test-Path -LiteralPath $OutputDir)) {
  New-Item -ItemType Directory -Path $OutputDir | Out-Null
}

$zipPath = Join-Path -Path $OutputDir -ChildPath $ZipName
$files = Get-ChildItem -LiteralPath $SourceDir -Filter "*.str"

if ($files.Count -eq 0) {
  Write-Error "Nenhum arquivo .str encontrado em $SourceDir"
  exit 1
}

if (Test-Path -LiteralPath $zipPath) {
  Remove-Item -LiteralPath $zipPath -Force
}

Add-Type -AssemblyName System.IO.Compression.FileSystem
$archive = [System.IO.Compression.ZipFile]::Open($zipPath, [System.IO.Compression.ZipArchiveMode]::Create)

foreach ($file in $files) {
  $entry = $archive.CreateEntry($file.Name, [System.IO.Compression.CompressionLevel]::Optimal)
  $entryStream = $entry.Open()
  $fileStream = [System.IO.File]::OpenRead($file.FullName)
  $fileStream.CopyTo($entryStream)
  $entryStream.Close()
  $fileStream.Close()
}

$archive.Dispose()

Write-Host "Pacote criado: $zipPath"
Write-Host "Arquivos incluídos:"
foreach ($file in $files) {
  Write-Host "  - $($file.Name)"
}
Write-Host ""
Write-Host "Instruções:"
Write-Host "1. Vá até https://github.com/Edgarcsr/t6-translation-ptbr/releases/new"
Write-Host "2. Tag: v1.0.0"
Write-Host "3. Título: v1.0.0"
Write-Host "4. Anexar: $zipPath"
Write-Host "5. Publicar"
