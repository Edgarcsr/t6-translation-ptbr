# Quick Start — TL;DR

**Tempo total:** ~5 minutos para setup

---

## 1️⃣ Extrair Strings (5min)

```powershell
cd internal/tools/t6-translator
./t6-translator.exe
# Escolha [1] Extract
```

Resultado: `translation/source/zone_dump/` ✅

---

## 2️⃣ Copiar e Traduzir (5min + tempo de tradução)

```powershell
# Copie o arquivo que quer traduzir
cp translation/source/zone_dump/en_patch_zm.str translation/ptbr/zone_raw/
```

Abra em VSCode e traduza:
- Procure por `LANG_ENGLISH` com texto em inglês
- Mude para português
- **Não mude** `REFERENCE`, `VERSION`, `CONFIG`, `ENDMARKER`
- Não use acentos (use "voce" não "você")

---

## 3️⃣ Deploy para Plutonium (2min)

```powershell
$src = "translation\ptbr\zone_raw"
$dst = "$env:LOCALAPPDATA\Plutonium\storage\t6\raw\localizedstrings"
Copy-Item "$src\*.str" -Destination $dst -Force
Write-Host "✅ Done! Restart Plutonium T6"
```

---

## 4️⃣ Testar (1min)

1. Restart Plutonium T6
2. Abra um menu (Solo Play)
3. Deve estar em português ✅

---

## Quais Arquivos Traduzir?

| Arquivo | O que traduz |
|---------|------------|
| `en_patch_zm.str` | Menus de Zombies (recomendado começar) |
| `en_patch_mp.str` | Menus de Multiplayer |
| `en_common.str` | Botões e textos comuns |
| `en_code_post_gfx_zm.str` | HUD de Zombies (pontuação, round) |
| `en_code_post_gfx_mp.str` | HUD de Multiplayer |

---

## Problemas?

| Problema | Solução |
|----------|---------|
| Menu em inglês | Arquivo não copiou? Verifique `%localappdata%\Plutonium\storage\t6\raw\localizedstrings\` |
| Caracteres errados | Encoding errado. Use UTF-8 com BOM, não ANSI |
| Game travou | Remova o arquivo e teste novamente |

---

## Commit no Git

```powershell
git add translation/ptbr/zone_raw/
git commit -m "feat: add PT-BR translations for patch_zm"
git push
```

---

**Next:** Ver `docs/TRANSLATION_WORKFLOW.md` para detalhes
