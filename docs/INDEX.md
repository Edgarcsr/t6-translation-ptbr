# 📚 Documentação — Índice

## 🚀 Onde Começar?

### Você quer... **começar AGORA, sem muitas explicações?**
→ **[QUICK_START.md](./QUICK_START.md)** — 5 minutos, 4 passos

### Você quer... **entender o fluxo completo passo-a-passo?**
→ **[TRANSLATION_WORKFLOW.md](./TRANSLATION_WORKFLOW.md)** — Guia detalhado com exemplos

### Você quer... **entender como o sistema RAW funciona?**
→ **[RAW_OVERRIDE_SYSTEM.md](./RAW_OVERRIDE_SYSTEM.md)** — Explicação técnica do override

---

## 📖 Documentação por Tópico

### 🎯 Tarefas Específicas

| Tarefa | Arquivo |
|--------|---------|
| "Como extraio as strings originais?" | TRANSLATION_WORKFLOW.md § Step 1 |
| "Como traduzo um arquivo `.str`?" | TRANSLATION_WORKFLOW.md § Step 2 |
| "Como coloco a tradução no Plutonium?" | TRANSLATION_WORKFLOW.md § Step 4 |
| "Como testo se a tradução funcionou?" | TRANSLATION_WORKFLOW.md § Step 5 |
| "Qual é o limite de strings?" | RAW_OVERRIDE_SYSTEM.md § Pontos-Chave |
| "Preciso compilar algo?" | RAW_OVERRIDE_SYSTEM.md ou QUICK_START.md (resposta: NÃO) |

### 🔍 Entendimento Técnico

| Conceito | Arquivo |
|----------|---------|
| Diferença entre RAW e MOD | RAW_OVERRIDE_SYSTEM.md ou CLAUDE.md |
| Por que Plutonium carrega meus arquivos | RAW_OVERRIDE_SYSTEM.md § Como Funciona |
| Limites de strings do T6 | CLAUDE.md § Overview |
| Encoding e caracteres acentuados | TRANSLATION_WORKFLOW.md § Step 2 ou RAW_OVERRIDE_SYSTEM.md § Notas Técnicas |

### 📂 Estrutura do Projeto

Veja: [README.md](../README.md) § Estrutura do Projeto

```
translation/
├── source/zone_dump/          ← Strings originais do jogo
├── ptbr/zone_raw/             ← VOCÊ TRABALHA AQUI (strings traduzidas)
└── backup/                    ← Backup dos .ff originais
```

---

## ⚙️ Ferramentas

### `t6-translator` (antes `path-selector`)
**O que faz:** Extrai strings do jogo usando `Unlinker.exe`

**Localização:** `internal/tools/t6-translator/`

**Uso:**
```powershell
cd internal/tools/t6-translator
./t6-translator.exe
```

**Menu:**
- `[1] Extract` — extrai `zone/english/*.ff` para `translation/source/zone_dump/`
- `[2] Build` — (futuro) compila `.ff` traduzido

---

## 📋 Checklist de Setup

- [ ] Leu [QUICK_START.md](./QUICK_START.md) ou [TRANSLATION_WORKFLOW.md](./TRANSLATION_WORKFLOW.md)
- [ ] Rodou `t6-translator.exe [1] Extract`
- [ ] Arquivos `.str` em `translation/source/zone_dump/` ✅
- [ ] Escolheu qual arquivo traduzir (recomendação: `en_patch_zm.str`)
- [ ] Criou cópia em `translation/ptbr/zone_raw/`
- [ ] Começou a traduzir (só mude `LANG_ENGLISH`)
- [ ] Encoding UTF-8 com BOM ✅
- [ ] Copiou para `%localappdata%\Plutonium\storage\t6\raw\localizedstrings\`
- [ ] Testou em Plutonium T6 ✅

---

## 🔗 Referência Rápida

### Arquivos mais importantes

```
translation/ptbr/zone_raw/
├── en_patch_zm.str       ← Menus de Zombies (COMECE AQUI)
├── en_patch_mp.str       ← Menus de Multiplayer
└── ... (outros)

%localappdata%\Plutonium\storage\t6\raw\localizedstrings\
└── en_patch_zm.str       ← Cópia final para Plutonium
```

### Comando de Deploy (PowerShell)

```powershell
$src = "translation\ptbr\zone_raw"
$dst = "$env:LOCALAPPDATA\Plutonium\storage\t6\raw\localizedstrings"
Copy-Item "$src\*.str" -Destination $dst -Force
```

### Comando de Commit

```powershell
git add translation/ptbr/zone_raw/
git commit -m "feat: add PT-BR translations for patch_zm"
```

---

## 🆘 Precisa de Ajuda?

1. **Erro técnico?** → Ver TRANSLATION_WORKFLOW.md § Step 5 "Problemas?"
2. **Pergunta sobre encoding?** → Ver RAW_OVERRIDE_SYSTEM.md § Notas Técnicas
3. **Não entendi o fluxo** → Ler QUICK_START.md primeiro
4. **Quer entender profundamente** → Ler TRANSLATION_WORKFLOW.md + RAW_OVERRIDE_SYSTEM.md

---

## 📝 Histórico de Documentação

| Data | O que mudou |
|------|------------|
| 2026-07-14 | Documentação criada com descoberta do sistema RAW |
| 2026-07-14 | Renomeação planejada: `path-selector` → `t6-translator` |
| 2026-07-14 | Workflow documentado: extract → translate → deploy |

---

**Última atualização:** 2026-07-14
