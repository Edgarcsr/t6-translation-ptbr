# 🎨 Translation Manager UI Design

Nova interface inspirada em design moderno com Tailwind CSS, Lucide Icons e animações de status.

---

## 📐 Componentes Principais

### 1. **Header**
- Título: "T6 Translation"
- Subtítulo: "Portuguese-BR Distribution"
- Botão de Settings (gear icon) para expandir/recolher configurações

### 2. **Card Principal (Orange/Red)**
- **Elemento central:** Porcentagem de tradução (80%)
- **Status indicator:** Bolinha com ping animado
  - 🔘 Cinza (sem animação) = `idle` — pronto para começar
  - 🟡 Amber (com ping) = `downloading` ou `applying` — processando
  - 🟢 Emerald (com ping) = `downloaded` ou `applied` — concluído
- **Label de status:** Texto descritivo do estado atual
- **Descrição:** "Pode fazer download agora e aplicar..."

### 3. **Action Buttons (Grid 2 cols)**
- **Botão Baixar** (azul)
  - Desabilitado após sucesso de aplicação
  - Ícone: Download (Lucide)
  
- **Botão Aplicar** (verde/esmeralda)
  - Desabilitado até que tenha um ZIP baixado
  - Ícone: Check (Lucide)
  - Muda cor conforme o status

### 4. **Settings Panel** (Expansível)
- Visível quando clica no ícone de Settings
- Campos para customizar:
  - Owner (GitHub)
  - Repository name
  - Release tag
- Desabilitados durante download/aplicação

### 5. **Error Display** (Red, condicional)
- Só aparece se houver erro
- Ícone: AlertCircle
- Mostra mensagem de erro detalhada

### 6. **Info Cards** (Grid)
- Status atual
- Repositório GitHub (owner/name)
- Localização Plutonium (path completo)

---

## 🎯 Estados da Aplicação

| Estado | Status Dot | Botão Download | Botão Aplicar | Descrição |
|--------|-----------|-----------------|---------------|-----------|
| `idle` | 🔘 Gray | ✅ Habilitado | ❌ Desabilitado | Inicio |
| `downloading` | 🟡 Amber + ping | ❌ Processando | ❌ Desabilitado | Baixando ZIP |
| `downloaded` | 🟢 Emerald + ping | ❌ Desabilitado | ✅ Habilitado | Pronto para aplicar |
| `applying` | 🟡 Amber + ping | ❌ Desabilitado | ❌ Processando | Aplicando tradução |
| `applied` | 🟢 Emerald + ping | ❌ Concluído | ✅ Sucesso | Tudo pronto! |
| `error` | 🔴 Red (sem ping) | ✅ Pode retry | ✅ Se tem ZIP | Erro ocorreu |

---

## 🎨 Cores (Tailwind)

- **Background:** `from-slate-950 via-slate-900 to-slate-950` (gradiente dark)
- **Card Principal:** `from-orange-600 to-orange-700`
- **Settings Panel:** `bg-slate-800/50` com backdrop blur
- **Botão Download:** `bg-blue-600 hover:bg-blue-700`
- **Botão Aplicar:** `bg-emerald-600 hover:bg-emerald-700`
- **Error Panel:** `bg-red-950/50 border-red-900`
- **Info Cards:** `bg-slate-800/50 border-slate-700`

---

## 🔄 Transições & Animações

- **Button hover:** Scale 95% on active
- **Status dot:** `animate-ping` quando downloading/applying/applied
- **Cards:** Smooth color transitions
- **Icons:** Lucide React (animação nativa via animação CSS)

---

## 📱 Layout Responsivo

- **Max width:** 2xl (42rem)
- **Padding:** Responsivo (p-6)
- **Grid:** 2 colunas em desktop, stack em mobile
- **Cards:** Flex grow para buttons

---

## 🎯 Fluxo de Interação

```
1. Usuário abre app
   ↓
2. Vê card com 80% de tradução
   ↓
3. Clica "Baixar" → status muda para "downloading" (amber com ping)
   ↓
4. Download completa → status "downloaded" (green com ping)
   ↓
5. Clica "Aplicar" → status muda para "applying" (amber com ping)
   ↓
6. Aplicação completa → status "applied" (green com ping)
   ↓
7. Mostra sucesso, botão "Aplicar" fica verde (já aplicado)
   ↓
8. Usuário reinicia Plutonium e pronto! 🎮
```

---

## 🔧 Técnica de Implementação

### Status Indicator (Bolinha com Ping)

```tsx
<div
  className={`w-4 h-4 rounded-full ${config.color} ${
    config.animate ? "animate-ping" : ""
  }`}
></div>
```

**Onde:**
- `config.color` = cor do estado (`bg-gray-500`, `bg-amber-500`, `bg-emerald-500`, etc)
- `animate-ping` = animação Tailwind nativa (pulse growing)

### Botão Dinâmico

```tsx
<button
  disabled={
    status !== "downloaded" &&
    status !== "error" &&
    status !== "applied"
  }
  className={`${
    status === "downloaded" || (status === "error" && zipPath)
      ? "bg-emerald-600 hover:bg-emerald-700"
      : "bg-slate-700 text-slate-400 cursor-not-allowed"
  }`}
>
```

### Icons (Lucide React)

- `Download` = ícone de download
- `Check` = ícone de confirmar
- `AlertCircle` = ícone de alerta
- `Settings` = ícone de engrenagem

---

## 🎨 Design Inspirations

- **Tesla App:** Cards grandes com status indicator
- **Modern Dashboard:** Dark theme com gradientes
- **Tailwind UI:** Color palette e spacing

---

## 📦 Dependências

- `lucide-react` — Icons
- `tailwindcss` — Styling
- `react` 19.1.0
- `@tauri-apps/api` 2

---

## 🚀 Próximos Passos

- [ ] Atualizar porcentagem real baseado em arquivos `.str` traduzidos
- [ ] Mostrar animação de progresso durante download
- [ ] Adicionar ícone na bandeja do Windows
- [ ] Auto-update da aplicação
- [ ] Suporte para múltiplas releases (changelog)

---

*Última atualização: 2026-07-14*
