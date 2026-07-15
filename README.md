![Black Ops II - PTBR](https://shieldcn.dev/header/surface.svg?title=Black+Ops+II+-+PTBR&subtitle=A+portuguese+T6+game+fan-made+translation&logo=https%3A%2F%2Fcdn2.steamgriddb.com%2Ficon_thumb%2F7909706a139205d2861549e24ac45dda.png&mode=dark)

<p align="center">
  <img src="https://shieldcn.dev/badge/Built%20with-Claude-D97757.svg?logo=anthropic&variant=secondary" alt="Built with Claude" />
  <img src="https://shieldcn.dev/flag/br.svg" alt="Feito no Brasil" />
</p>

## Instalar em 2 cliques

Baixe o instalador para sua plataforma. Abre automaticamente, copia os arquivos, e pronto:

<p align="center">
  <a href="https://github.com/Edgarcsr/t6-translation-ptbr/releases/latest">
    <img src="https://shieldcn.dev/badge/Windows-blue?logo=windows" alt="Download Windows" />
  </a>
  <a href="https://github.com/Edgarcsr/t6-translation-ptbr/releases/latest">
    <img src="https://shieldcn.dev/badge/macOS-black?logo=apple" alt="Download macOS" />
  </a>
  <a href="https://github.com/Edgarcsr/t6-translation-ptbr/releases/latest">
    <img src="https://shieldcn.dev/badge/Linux-orange?logo=linux" alt="Download Linux" />
  </a>
</p>

**Tauri desktop app.** Sem dependências externas. Funciona offline após o download inicial.

## Progresso da Tradução

**55.587+ strings traduzidas** e funcionando em jogo via sistema RAW.

| Arquivo                              | Strings | Cobertura               |
| ------------------------------------ | ------- | ----------------------- |
| `en_code_post_gfx_mp_translated.str` | 33.879  | Menus MP + HUD          |
| `en_code_post_gfx_zm_translated.str` | 21.708  | Menus ZM + HUD          |
| `en_patch_zm.str`                    | 2.308   | Zombies (perks, portas) |
| `en_patch_mp.str`                    | 2.475   | Multiplayer             |
| `en_ui_mp.str`                       | 306     | UI Multiplayer          |
| `en_ui_zm.str`                       | 306     | UI Zombies              |

## Como Funciona

A tradução usa o sistema **RAW** do Plutonium — nenhuma compilação ou mod ativado necessário. Os arquivos `.str` são carregados automaticamente ao iniciar o jogo.

- Sem limite de strings por arquivo (cada arquivo processa independentemente)
- Perfil e stats preservados (não cria save profile separado)
- Acentos funcionam nativamente: é, ã, ç, õ, ô, í, ó, ú, ê renderizam perfeitamente

## Instalação Manual

Se preferir copiar os arquivos manualmente:

```powershell
$src = "translation\ptbr\zone_raw"
$dst = "$env:LOCALAPPDATA\Plutonium\storage\t6\raw\localizedstrings"
Copy-Item "$src\*.str" -Destination $dst -Force
```

Reinicie o Plutonium T6. Pronto.

## Documentação

- **Guia completo:** [TRANSLATION_WORKFLOW.md](./docs/TRANSLATION_WORKFLOW.md) — processo de extração e tradução
- **Sistema RAW:** [RAW_OVERRIDE_SYSTEM.md](./docs/RAW_OVERRIDE_SYSTEM.md) — como o override funciona
- **Workflow & constraints:** [CLAUDE.md](./CLAUDE.md) — notas técnicas do projeto

---

## Para Contribuidores

Estrutura do repositório:

```
translation/
├── source/zone_dump/               # Strings originais (extraído do jogo)
└── ptbr/zone_raw/                  # Strings traduzidas
    └── *.str                        # Cada arquivo = ~2k-33k strings
```

Os arquivos foram consolidados de 80+ chunks em 6 arquivos principais para facilitar versionamento e deploy. Veja `TRANSLATION_WORKFLOW.md` para o workflow completo.

---

_Tradução não-oficial. Não afiliado à Activision, Treyarch ou Plutonium._
