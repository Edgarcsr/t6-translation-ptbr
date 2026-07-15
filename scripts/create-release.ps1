# Script para criar e publicar release no GitHub
# Uso: .\create-release.ps1 -Version "v1.0.0" -Token "seu_github_token"

param(
    [string]$Version = "v1.0.0",
    [string]$Token = "",
    [string]$Owner = "edgarcsr",
    [string]$Repo = "t6-translation-ptbr"
)

$srcDir = "translation/ptbr/localizedstrings"
$zipName = "translation.zip"
$zipPath = "./$zipName"

Write-Host "🔨 Preparando release $Version..." -ForegroundColor Cyan

# 1. Criar ZIP
if (Test-Path $zipPath) {
    Remove-Item $zipPath -Force
    Write-Host "❌ ZIP anterior removido"
}

Write-Host "📦 Compactando $srcDir..." -ForegroundColor Yellow
if (Test-Path $srcDir) {
    Add-Type -AssemblyName System.IO.Compression.FileSystem
    [System.IO.Compression.ZipFile]::CreateFromDirectory((Resolve-Path $srcDir), (Resolve-Path -LiteralPath $zipPath))
    Write-Host "✅ ZIP criado: $zipPath" -ForegroundColor Green

    $fileSize = (Get-Item $zipPath).Length / 1MB
    Write-Host "📊 Tamanho: $([Math]::Round($fileSize, 2)) MB"
}
else {
    Write-Host "❌ Diretório não encontrado: $srcDir" -ForegroundColor Red
    exit 1
}

# 2. Commit e tag
Write-Host "📝 Git commit e tag..." -ForegroundColor Yellow
git add -A
git commit -m "chore: prepare release $Version"
git tag $Version
Write-Host "✅ Tag criada: $Version" -ForegroundColor Green

# 3. Push e criar release (se token fornecido)
if ($Token) {
    Write-Host "🚀 Fazendo push..." -ForegroundColor Yellow
    git push origin $Version

    Write-Host "📤 Criando release no GitHub..." -ForegroundColor Yellow
    $releaseBody = @"
## Translation Release

**Version:** $Version

This release contains the Portuguese-BR translation for Call of Duty: Black Ops II (Plutonium).

### How to use:
1. Download \`translation.zip\`
2. Extract and copy \`.str\` files to:
   \`%LOCALAPPDATA%\Plutonium\storage\t6\raw\localizedstrings\`
3. Restart Plutonium

### Or use the Translation Manager:
1. Open the Translation Manager app
2. Click "📥 Baixar Tradução"
3. Click "📂 Aplicar Tradução"

Enjoy! 🎮
"@

    gh release create $Version $zipPath --repo "$Owner/$Repo" --title "Release $Version" --notes $releaseBody --latest
    Write-Host "✅ Release criada no GitHub" -ForegroundColor Green
}
else {
    Write-Host "⚠️ Token não fornecido. Realize push manualmente:" -ForegroundColor Yellow
    Write-Host "   git push origin $Version"
    Write-Host ""
    Write-Host "   Depois crie a release manualmente ou use:" -ForegroundColor Yellow
    Write-Host "   gh release create $Version $zipPath --repo $Owner/$Repo"
}

Write-Host ""
Write-Host "✨ Pronto!" -ForegroundColor Green
Write-Host "ZIP pronto em: $zipPath"
