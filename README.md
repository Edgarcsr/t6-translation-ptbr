<p align="center">
  <img src="https://shieldcn.dev/header/gradient.svg?title=BO2%20PT-BR&subtitle=Traducao%20nao-oficial%20de%20Call%20of%20Duty%3A%20Black%20Ops%20II%20para%20Portugues%20do%20Brasil&theme=emerald" alt="BO2 PT-BR" />
</p>

<p align="center">
  <img src="https://shieldcn.dev/badge/Built%20with-Claude-D97757.svg?logo=anthropic&variant=secondary" alt="Built with Claude" />
  <img src="https://shieldcn.dev/flag/br.svg" alt="Feito no Brasil" />
</p>

<p align="center">
  Projeto de tradução fan-made de <strong>Call of Duty: Black Ops II</strong> (T6) para <strong>Português do Brasil</strong>,
  rodando sobre <a href="https://plutonium.pw">Plutonium</a>.
</p>

---

## Status atual

**3 arquivos traduzidos, ~2.400 strings.** Funcionando em jogo via sistema RAW de override.

| Arquivo | Strings | Status |
|---|---|---|
| `en_patch_zm.str` | 2.308 | ✅ Completo (com acentos) |
| `en_code_post_gfx_mp.str` | strings-chave | ✅ "PARTIDAS PERSONALIZADAS", "Opções" |
| `en_code_post_gfx_zm.str` | strings-chave | ✅ "PARTIDAS PERSONALIZADAS", "Opções" |
| 80+ arquivos restantes | ~45.000 | ⏳ Pendente |

## Sistema RAW de Override ✅ (Método Preferido)

**Não precisa compilar nada!** Basta colocar arquivos `.str` traduzidos em:

```
%localappdata%\Plutonium\storage\t6\raw\localizedstrings\
```

Plutonium carrega automaticamente, sem limite de strings por arquivo, e **mantém seu perfil/stats intacto**.

## Acentos

**CONFIRMADO:** acentos funcionam perfeitamente no T6. Use PT-BR correto:

- é, ã, ç, õ, ô, í, ó, ú, ê — todos renderizam sem problemas
- "você" em vez de "voce", "opções" em vez de "opcoes", "não" em vez de "nao"

## Estrutura do Projeto

```
translation/
├── source/zone_dump/          # Strings originais extraídas (NÃO EDITAR)
└── ptbr/localizedstrings/     # ⬅️ SEU TRABALHO FICA AQUI
    ├── en_patch_zm.str        # ✅ Traduzido (patches Zombies)
    ├── en_code_post_gfx_mp.str# ✅ Traduzido (HUD Multiplayer)
    └── en_code_post_gfx_zm.str# ✅ Traduzido (HUD Zombies)
```

## Deploy Rápido

```powershell
$src = "translation\ptbr\localizedstrings"
$dst = "$env:LOCALAPPDATA\Plutonium\storage\t6\raw\localizedstrings"
Copy-Item "$src\*.str" -Destination $dst -Force
```

## 📚 Documentação

- **Guia completo:** [TRANSLATION_WORKFLOW.md](./docs/TRANSLATION_WORKFLOW.md)
- **Sistema RAW:** [RAW_OVERRIDE_SYSTEM.md](./docs/RAW_OVERRIDE_SYSTEM.md)
- **Workflow & constraints:** [CLAUDE.md](./CLAUDE.md)

---

*Tradução não-oficial. Não afiliado à Activision, Treyarch ou Plutonium.*
