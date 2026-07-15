---
version: alpha
name: T6 Translation Manager
colors:
  primary: "#EF7B00"
  primary-hover: "#D96D00"
  primary-muted: "#EF7B0020"
  surface: "#000000"
  surface-elevated: "#171717"
  surface-card: "#171717"
  border: "#262626"
  border-light: "#404040"
  ink: "#FFFFFF"
  ink-secondary: "#A3A3A3"
  ink-muted: "#737373"
  success: "#10B981"
  success-muted: "#10B98120"
  error: "#EF4444"
  error-bg: "#EF444020"
  error-border: "#EF444040"
typography:
  h1:
    fontFamily: system-ui, -apple-system, sans-serif
    fontSize: 20px
    fontWeight: 600
    lineHeight: 1.3
  h2:
    fontFamily: system-ui, -apple-system, sans-serif
    fontSize: 14px
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: 0.05em
    textTransform: uppercase
  body:
    fontFamily: system-ui, -apple-system, sans-serif
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.5
  body-sm:
    fontFamily: system-ui, -apple-system, sans-serif
    fontSize: 12px
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: system-ui, -apple-system, sans-serif
    fontSize: 12px
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: 0.05em
    textTransform: uppercase
  mono:
    fontFamily: ui-monospace, SFMono-Regular, monospace
    fontSize: 12px
    fontWeight: 400
    lineHeight: 1.5
rounded:
  sm: 8px
  md: 12px
  lg: 16px
  xl: 24px
spacing:
  xs: 4px
  sm: 8px
  md: 12px
  lg: 16px
  xl: 24px
  xxl: 40px
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: 12px 16px
    fontWeight: 500
    fontSize: 14px
  button-primary-hover:
    backgroundColor: "{colors.primary-hover}"
  button-primary-disabled:
    backgroundColor: "{colors.surface-card}"
    textColor: "{colors.ink-muted}"
  button-secondary:
    backgroundColor: "{colors.success}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: 12px 16px
    fontWeight: 500
    fontSize: 14px
  button-secondary-disabled:
    backgroundColor: "{colors.surface-card}"
    textColor: "{colors.ink-muted}"
  card:
    backgroundColor: "{colors.surface-card}"
    rounded: "{rounded.lg}"
    padding: 24px
    borderColor: "{colors.border}"
    borderWidth: 1px
  input:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.sm}"
    padding: 10px 14px
    borderColor: "{colors.border}"
    borderWidth: 1px
    textColor: "{colors.ink}"
  input-focus:
    borderColor: "{colors.primary}"
  badge:
    rounded: "{rounded.sm}"
    padding: 4px 10px
    fontSize: 12px
    fontWeight: 500
---

## Overview

A dark, clean desktop utility for installing the BO2 PT-BR translation. The interface follows modern game launcher conventions — deep backgrounds, glowing accent colors, and card-based information hierarchy. Every element feels deliberate and responsive without being decorative. The orange accent (#EF7B00) provides a warm, energetic focal point against the true black canvas, evoking the Call of Duty franchise's signature color palette while remaining distinct.

## Colors

The palette is built around a single warm orange accent on a high-contrast dark foundation, inspired by modern game launchers like Battle.net and Steam.

- **Primary (#EF7B00):** A vibrant, warm orange used exclusively for the primary call-to-action (download button) and interactive highlights. It's the single visual anchor of the interface.
- **Surface (#000000):** True black used as the page background, creating a deep canvas that makes the orange pop.
- **Surface Elevated (#171717):** Neutral-900 for cards and panels, providing subtle depth through tonal layering rather than shadows.
- **Border (#262626):** Neutral-800 for card and container borders — visible but unobtrusive.
- **Ink (#FFFFFF):** Pure white for headings and primary text.
- **Ink Secondary (#A3A3A3):** Neutral-400 for body text and descriptions.
- **Ink Muted (#737373):** Neutral-500 for secondary labels, footnotes, and placeholders.
- **Success (#10B981):** Emerald for the apply button and success states, providing a clear semantic distinction from the download action.

### Semantic color map

| Role | Token | Usage |
|---|---|---|
| Download action | `primary` (#EF7B00) | Baixar button |
| Apply action | `success` (#10B981) | Aplicar button |
| Error | `error` (#EF4444) | Error banner, alert icon |
| Idle status | `ink-muted` | Status badge default |
| Processing | amber-400 | Status badge during download/apply |
| Complete | `success` | Status badge on success |
| Link/Focus ring | `primary` (#EF7B00) | Input focus, interactive elements |

## Typography

Typography uses the system font stack for a native desktop feel — no custom fonts, no loading delays. The hierarchy is minimal: three text sizes serve the entire interface.

- **Titles (20px, semibold):** Used for the app header "T6 Translation" and section titles.
- **Body (14px, regular):** All descriptive text, status messages, and button labels.
- **Small (12px, regular):** Secondary info, code paths, footnotes, and folder paths.
- **Uppercase labels (12px, medium, 0.05em tracking):** Card section headers like "INSTALAÇÃO" and "REPOSITÓRIO" for consistent info-card styling.

| Level | Size | Weight | Usage |
|---|---|---|---|
| `h1` | 20px | 600 | App title |
| `h2` (caps) | 12px | 500 | Info card section headers |
| `body` | 14px | 400 | Status text, descriptions |
| `body-sm` | 12px | 400 | Helper text, path display |
| `mono` | 12px | 400 | File paths, code values |

## Layout & Spacing

The layout follows a bento grid pattern — a 2-column CSS Grid with asymmetric card sizes, optimized for desktop tool windows.

- **Max content width:** 42rem (672px / 2xl)
- **Page padding:** 24px (p-6) horizontal, 32px (py-8) vertical
- **Card internal padding:** 20px (p-5) for bento cards, 24px (p-6) for the hero square
- **Spacing scale:** 4px base with 4-8-12-16-20-24-40 progression
- **Grid gap:** 16px between all cards
- **Action buttons:** Side-by-side in a flex row, equal width, with 8px gap

### Component sequence

Header → Bento Grid (hero square + 3 right cards) → Path Cards (2 columns) → Footer

### Grid structure

```
┌──────────────────────┬───────────────────────┐
│                      │  Card 1 / Download    │
│   Hero Square        ├───────────────────────┤
│   (orange bg,        │  Card 2 / Steam Fix   │
│    3 rows tall)      ├───────────────────────┤
│                      │  Card 3 / Empty       │
├──────────────────────┴───────────────────────┤
│  Path Card / BO2         │  Path / Plutonium │
└──────────────────────────────────────────────┘
```

## Elevation & Depth

Depth is achieved through tonal layering rather than shadows. The background surface (#000000) is elevated through progressively lighter card surfaces (#171717) with visible borders (#262626). The settings overlay uses a semi-transparent black backdrop (#00000099) with the panel card at the top.

- **Page background:** `surface` (#000000)
- **Card surfaces:** `surface-elevated` (#171717) with 1px `border` stroke
- **Overlay backdrop:** `rgba(0, 0, 0, 0.6)` behind settings panel
- **No box shadows** — all depth is conveyed through surface color and borders

## Shapes

Corner radii are consistently generous, giving the interface a polished, modern feel.

- **Cards:** 16px (rounded-2xl)
- **Buttons:** 12px (rounded-xl)
- **Input fields:** 8px (rounded-lg)
- **Badges:** 6px (rounded-md)
- **Icon buttons:** 8px (rounded-lg)

## Components

### Hero Square (Orange)

The hero card dominates the left side of the bento grid, spanning 3 rows. It has an orange (#EF7B00) background with white text.

- **Active badge:** Pill with white dot + `animate-ping`, semi-transparent white background
- **Translation percentage:** 36px bold white with a smaller "%" suffix at 60% opacity
- **Subtitle:** "traduzido" in white at 80% opacity
- **GitHub link:** Inline icon + text link at the bottom, white at 80% opacity, full opacity on hover

### Card 1 — Download (one row)

Horizontal one-row compact card. All content sits in a single flex row.

- **Icon container:** 36px circle, neutral-800 background, neutral-400 icon
- **Text:** "Download" (14px semibold) + "Baixar e aplicar tradução" (12px, neutral-500, truncated)
- **Buttons:** Two side-by-side compact buttons
  - Baixar: Orange (#EF7B00), spinner during download, disabled at neutral-800
  - Aplicar: Emerald (#10B981), spinner during apply

### Card 2 — Steam Launch Fix (white, one row)

Horizontal one-row card with a white background for visual contrast.

- **Icon container:** 36px circle, neutral-100 background, neutral-500 icon
- **Text:** "Steam Launch Fix" (14px semibold, neutral-900) + "Iniciar BO2 pelo Plutonium" (12px, neutral-500, truncated)
- **Install/Uninstall button:** Brand orange when installing, red-500 when uninstalling/removing, spinner during async operation

### Card 3 — Empty Placeholder

Compact dashed-border card with centered "Em breve" text.

### Settings Overlay

Full-screen overlay with centered modal panel. Panel includes:
- Header with GitHub icon + "Configurar repositório" title + close (X) button
- Three input fields: Owner, Repositório, Release tag
- Inputs disabled during active download/apply operations
- Closes on Escape key or backdrop click

### Path Cards

Two-column row of read-only path display cards below the bento grid.

- Each card: rounded-2xl, neutral-900 background, neutral-800 border, 20px padding
- **Header row:** Small icon (neutral-500) + uppercase label (11px, tracking-wider, neutral-500)
- **Path value:** 12px mono font, break-all, neutral-400

Variants:
- **BO2 Path:** Gamepad2 icon, shows the Steam installation directory
- **Plutonium Path:** FolderOpen icon, shows the Plutonium storage path

## Do's and Don'ts

- Do use the orange primary color exclusively for the download action and interactive focus states
- Don't use orange for success states — emerald belongs to the apply action
- Do maintain the dark theme throughout — no light/white surfaces for cards or backgrounds
- Don't add decorative gradients, glassmorphism, or texture overlays to cards
- Do convey status through both color AND text labels (never color alone)
- Don't stack more than two primary actions in a row — the flow is download then apply
- Do respect reduced-motion preferences — status ping animations should be removed, only crossfade transitions remain
- Don't use box shadows for depth — rely on tonal surface layers and borders
