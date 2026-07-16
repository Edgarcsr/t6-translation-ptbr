<p align="center">
  <img src="https://shieldcn.dev/header/surface.svg?title=Black+Ops+II+-+PTBR&subtitle=A+portuguese+T6+game+fan-made+translation&logo=https%3A%2F%2Fcdn2.steamgriddb.com%2Ficon_thumb%2F7909706a139205d2861549e24ac45dda.png&mode=dark" alt="Black Ops II - PTBR" />
</p>

<p align="center">
  <img src="https://shieldcn.dev/badge/Built%20with-Claude-D97757.svg?logo=anthropic&variant=secondary" alt="Built with Claude" />
  <img src="https://shieldcn.dev/flag/br.svg" alt="Feito no Brasil" />
</p>

Tradução para português brasileiro do Call of Duty: Black Ops II (T6) no Plutonium — **23.900+ strings** traduzidas e funcionando em jogo.

---

## Pré-requisitos

- Plutonium instalado e T6 executado pelo menos uma vez

## Instalação

Baixe o instalador mais recente e execute:

<p align="center">
  <a href="https://github.com/Edgarcsr/t6-translation-ptbr/releases/latest">
    <img src="https://shieldcn.dev/badge/Baixar%20Instalador-000000?logo=lu%3ADownload" alt="Baixar Instalador" />
  </a>
</p>

> O instalador mantém sua tradução atualizada e oferece alguns extras. Você também pode optar pela [instalação manual](#instalação-manual).

## Instalação Manual

1. Abra a pasta do Plutonium: `%localappdata%\Plutonium\storage\t6\raw\localizedstrings` (se `raw\localizedstrings` não existir, crie as pastas manualmente)
2. Extraia os arquivos `.str` da tradução dentro dessa pasta
3. Reinicie o Plutonium T6

Pronto. As strings são carregadas automaticamente — sem mods, sem compilação, sem perder seu progresso.

## Progresso

| Arquivo                     | Strings | Cobertura              |
| --------------------------- | ------- | ---------------------- |
| `en_code_post_gfx_mp.str`   | 11.292  | Multiplayer (menus/HUD)|
| `en_code_post_gfx_zm.str`   | 7.235   | Zombies (menus/HUD)    |
| `en_patch_mp.str`           | 2.475   | Multiplayer (patch)    |
| `en_patch_zm.str`           | 2.308   | Zombies (perks/portas) |
| `en_ui_mp.str`              | 306     | UI — Multiplayer       |
| `en_ui_zm.str`              | 306     | UI — Zombies           |

## Bugs Conhecidos

- **Modo Solo em Zombies:** ao iniciar uma partida solo, os textos não são traduzidos por motivo ainda não identificado.
- **Campanha:** a tradução é baseada no sistema RAW do Plutonium, que não suporta os arquivos de campanha. Isso fica para um momento futuro.

## Documentação

- [Guia de tradução](./docs/TRANSLATION_WORKFLOW.md) — extração, tradução e deploy
- [Sistema RAW](./docs/RAW_OVERRIDE_SYSTEM.md) — como o override funciona
- [Notas técnicas](./CLAUDE.md) — workflow e restrições

## Contribuir

```
translation/
├── source/zone_dump/        # Strings originais (extraídas do jogo)
└── ptbr/localizedstrings/   # Strings traduzidas
```

Os arquivos foram consolidados de 80+ chunks em 6 principais. Consulte o [guia de tradução](./docs/TRANSLATION_WORKFLOW.md) para o workflow completo.

## Doação

Gostou do trabalho? Pix: `4bef9d37-64d2-4a3d-b3f6-7e6528f190e0`

---

_Tradução não-oficial. Não afiliado à Activision, Treyarch ou Plutonium._

<p align="center">Feito com 🧡 para a comunidade de BOII</p>
