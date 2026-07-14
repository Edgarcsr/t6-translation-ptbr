<p align="center">
  <img src="https://shieldcn.dev/header/gradient.svg?title=BO2%20PT-BR&subtitle=Traducao%20nao-oficial%20de%20Call%20of%20Duty%3A%20Black%20Ops%20II%20para%20Portugues%20do%20Brasil&theme=emerald" alt="BO2 PT-BR" />
</p>

<p align="center">
  <img src="https://shieldcn.dev/badge/Built%20with-Claude-D97757.svg?logo=anthropic&variant=secondary" alt="Built with Claude" />
  <img src="https://shieldcn.dev/flag/br.svg" alt="Built in Brazil" />
</p>

<p align="center">
  Projeto de tradução fan-made de <strong>Call of Duty: Black Ops II</strong> (T6) para <strong>Português do Brasil</strong>,
  rodando sobre <a href="https://plutonium.pw">Plutonium</a>.
</p>

---

## Sobre

Este repositório contém as ferramentas e o processo usado para extrair, traduzir e reempacotar os textos do jogo
(menus, HUD, mensagens de sistema) de Black Ops II. Não é afiliado à Activision, Treyarch ou Plutonium.

O jogo não tem suporte nativo a Português — a tradução funciona sobrescrevendo/complementando as strings do
idioma inglês (`en_*`), já que não existe um slot de idioma "brazilian" reconhecido pelo motor.

## Como funciona

O pipeline usa o [OpenAssetTools](https://github.com/Laupetin/OpenAssetTools) (`Unlinker`/`Linker`) para
descompilar e recompilar os *fastfiles* (`.ff`) do jogo, mais uma ferramenta própria em Go
(`internal/tools/path-selector`) que automatiza esse processo.

```
┌──────────────┐     Unlinker      ┌───────────────────┐     edição      ┌──────────────────┐     Linker      ┌─────────────┐
│  zone/english │ ───────────────▶ │ translation/source │ ─────────────▶ │ translation/ptbr  │ ──────────────▶ │   mod.ff /  │
│   (.ff orig.) │                  │   (.str extraído)  │                │  (.str traduzido) │                 │   en_*.ff   │
└──────────────┘                   └───────────────────┘                 └──────────────────┘                  └─────────────┘
```

1. **Extração** — `path-selector.exe` roda o `Unlinker` sobre os `.ff` do jogo (`zone/english`) e despeja os
   arquivos de string (`localizedstrings/*.str`) em `translation/source/zone_dump/`.
2. **Tradução** — as entradas `REFERENCE` / `LANG_ENGLISH` são editadas manualmente, substituindo o texto em
   inglês pelo português (ver [Limitações](#limitações-conhecidas) sobre acentos).
3. **Build** — `path-selector.exe` roda o `Linker` para recompilar as strings traduzidas em novos `.ff`,
   usando `--load` para reaproveitar os demais assets do arquivo original.
4. **Empacotamento** — o `.ff` resultante é distribuído de uma das duas formas suportadas pela Plutonium
   (ver abaixo).

## Estrutura do projeto

```
internal/tools/path-selector/   # Ferramenta em Go que automatiza extração e build
internal/tools/oat-windows/     # Binários do OpenAssetTools (Unlinker.exe, Linker.exe)
translation/source/             # Dump bruto do inglês original (referência, não editar)
translation/ptbr/zone_raw/      # Arquivos .str traduzidos (fonte da tradução)
translation/ptbr/zone_source/   # Definições .zone usadas pelo Linker
translation/ptbr/zone/          # Saída compilada (.ff prontos)
translation/backup/             # Backup dos .ff originais do jogo, para restaurar
```

## Como usar

```powershell
cd internal/tools/path-selector
./path-selector.exe
```

O menu interativo detecta o caminho do jogo automaticamente (Steam ou Plutonium) e oferece:

- **[1] Extract** — descompila os `.ff` do jogo pra `translation/source/zone_dump`.
- **[2] Build** — recompila as strings traduzidas em `translation/ptbr/zone/brazilian`.

## Limitações conhecidas

A tradução de textos do T6 esbarra em restrições do próprio motor/Plutonium que **ainda não têm solução
definitiva**:

### 1. Substituir `zone/english/en_*.ff` diretamente trava o jogo
Sobrescrever os `.ff` originais do jogo é detectado pela Plutonium como conteúdo não-oficial. Se o nome
interno da zona compilada não bater exatamente com o nome do arquivo original (ex.: `patch_zm` em vez de
`en_patch_zm`), o carregamento trava silenciosamente, sem erro — o motor entra em um estado inconsistente
tentando resolver dependências entre zonas pelo nome. **Corrigido** neste projeto ao garantir que o nome
interno da zona sempre inclua o prefixo `en_`.

Mesmo com o nome correto, sobrescrever o arquivo oficial ainda dispara:

```
====================== COM_ERROR (1) ===============
A mod is required for custom maps.
=======================================================
```

Ou seja, a Plutonium **recusa carregar** um `.ff` de `zone/english` que não bata com o hash esperado do
conteúdo oficial. Não existe um jeito conhecido de contornar essa checagem sem passar pelo sistema de mods.

### 2. O sistema de mods (`fs_game`) funciona, mas isola o perfil
A alternativa segura é carregar a tradução como um **mod** (`storage/t6/mods/<nome>/mod.ff` +
`fs_game "mods/<nome>"`). Isso evita a checagem de integridade acima e as strings traduzidas realmente
aparecem no jogo — porém a Plutonium trata o mod como um contexto de save **separado** do perfil principal
(rank/stats resetam enquanto o mod está carregado).

### 3. Limite de entradas por mod (`g_copyInfo exceeded`)
Existe um limite interno (não documentado publicamente) de quantas strings um único mod consegue
sobrescrever de uma vez:

| Quantidade de strings | Resultado |
|---|---|
| 6 entradas (arquivo mínimo, só as chaves alteradas) | ✅ Carrega normalmente |
| ~10.852 entradas (cópia completa de dois arquivos originais) | ❌ `g_copyInfo exceeded` |

**Isso significa que traduzir o jogo inteiro de uma vez, pelo sistema de mods, provavelmente não é viável.**
A solução de contorno é montar arquivos de override **mínimos**, contendo só as `REFERENCE` realmente
alteradas (não uma cópia do arquivo original inteiro), e ir descobrindo o teto real por tentativa.

### 4. Caracteres acentuados podem causar problemas de fonte
A fonte usada pelo idioma inglês do jogo pode não ter os glifos de caracteres acentuados (á, é, í, ç, ã).
Por precaução, as strings traduzidas neste projeto evitam acentos (ex.: "esta" em vez de "está",
"voce" em vez de "você").

## Status atual

Tradução parcial de algumas strings de menu (Zombies: *Jogo Solo*, *Partidas Personalizadas*) validada via
mod de teste. Tradução completa do jogo ainda **bloqueada** pelas limitações acima.
