# Codecks Forecast — Extracted Component Styles

All values extracted from the live Codecks app at `mmensch.codecks.io`.

## Typography

**Font family:** `cdx-ebony, "Helvetica Neue", Helvetica, Arial, sans-serif`
- Ebony-Light.otf → `font-weight: 400` (normal)
- Ebony-LightItalic.otf → `font-weight: 400; font-style: italic`
- Ebony-Semibold.otf → `font-weight: 700` (bold)
- Ebony-SemiboldItalic.otf → `font-weight: 700; font-style: italic`

**Base body:** 16px, weight 400, line-height 21px, antialiased

---

## Color Palette (computed RGB values from live app)

### Backgrounds
| Token (approx) | RGB | Usage |
|---|---|---|
| grey-850 | `rgb(30, 35, 51)` / `#1e2333` | Main content area / forecast panel |
| grey-750 | `rgb(42, 48, 66)` / `#2a3042` | Top nav bar, group header rows, header row bg (alt) |
| grey-650 | `rgb(55, 61, 80)` / `#373d50` | Data rows, header row, total row, capacity header |
| grey-550 | `rgb(76, 82, 103)` / `#4c5267` | Toggle button container, toolbar button bg |
| grey-400 | `rgb(112, 117, 135)` / `#707587` | Active nav tab bg (Hand/Decks etc) |

### Text Colors
| Token (approx) | RGB | Usage |
|---|---|---|
| grey-0 | `rgb(255, 255, 255)` | Avatar badge text |
| grey-50 | `rgb(237, 238, 242)` / `#edeef2` | Page title, row labels, cell values, total values (fw 700) |
| grey-100 | `rgb(224, 226, 235)` / `#e0e2eb` | Column headers (11px, 700), group headers (12px, 700), row counts |
| grey-150 | `rgb(218, 223, 231)` / `#dadfe7` | Top nav tab text (15px, 700) |
| grey-200 | `rgb(205, 209, 226)` / `#cdd1e2` | Scope header label, inactive toggle text |
| grey-450 | `rgb(96, 103, 129)` / `#606781` | Dash/empty cell (`-`), border color |
| done-green | `rgb(0, 128, 0)` / `#008000` | "Done" count numbers (14px, 400/700) |

### Accent Colors
| RGB | Hex | Usage |
|---|---|---|
| `rgb(52, 180, 145)` | `#34b491` | Active toggle slider (Scope/Capacity) |
| `rgb(215, 248, 235)` | `#d7f8eb` | Active toggle text (green-tinted white) |
| `rgb(231, 223, 247)` | `#e7dff7` | Milestone dropdown text, priority filter text (purple-tinted) |
| `rgb(131, 98, 177)` | `#8362b1` | Milestone dropdown border |
| `rgb(192, 57, 66)` | `#c03942` | Deck color dots, overload text in capacity view |
| `rgb(64, 2, 6)` | `#400206` | Overloaded row background (capacity) |

---

## Component Specifications

### Top Navigation Bar
- **Container:** height 52px, bg `#2a3042`, display flex, gap 16px
- **Tab text:** 15px, weight 700, color `#dadfe7`
- **Active tab bg:** `#707587` (e.g. "Hand" or "Decks" when selected)

### Forecast Toolbar (below nav)
- **Container:** height 60px, display flex, align-items center, gap 24px
- **Background:** inherits from panel bg `#1e2333`

#### Page Title
- **"CE2 Forecast":** 18px, weight 700, color `#edeef2`

#### Scope / Capacity Toggle
- **Wrapper:** bg `#4c5267`, border 1px solid `#606781`, border-radius 6px, height 34px
- **Button text:** 14px, weight 700, padding 8px 12px, border-radius 6px
- **Inactive text color:** `#cdd1e2`
- **Active state:** green slider div (bg `#34b491`, w ~79px, h 34px, border-radius 6px) positioned behind active button
- **Active text color:** `#d7f8eb`
- **Separator:** `::before` pseudo, 1px wide, 16px tall, bg `#606781`

#### Milestone Dropdown
- **Border:** 1px solid `#8362b1` (purple-400)
- **Border-radius:** 4px
- **Padding:** 0 5px, height 32px
- **Text:** 14px, weight 700, color `#e7dff7`

#### Priority Filters (Low / Medium / High)
- **Text:** 12px, weight 400, color `#e7dff7`
- **Icon:** SVG with wave/crown pattern, 16×16px
- **Layout:** flex, gap 4px, cursor pointer
- **Container height:** 42px (centered in toolbar)

### Buffer Slider (Capacity view only)
- **Label:** "20% Buffer", 14px, weight 400, color `#edeef2`
- **Slider:** native range input

---

## Table Structure

### Scope View

#### Group Header Row (TASKS, QA, SOUND, ART, ARCHIVE)
- **Row bg:** `#2a3042` (grey-750)
- **Height:** 39px
- **Text:** 12px, weight 700, uppercase, letter-spacing 0.24px, color `#e0e2eb`, text-align center
- **Group separators:** 1px solid `rgb(128, 128, 128)` border-left on group containers

#### Column Header Row
- **Row bg:** alternates between `#2a3042` and `#373d50`
- **Column name:** 11px, weight 700, color `#e0e2eb`
- **Deck color dot:** 8px × 8px circle (border-radius 159984px), bg varies by deck (e.g. `#c03942`)
- **Cell padding:** 0 8px
- **Cell height:** 39px

#### Scope Label Column
- **Header text "Scope":** 14px, weight 700, color `#cdd1e2`

#### Data Rows
- **Row height:** 39px
- **Row bg:** `#373d50` (grey-650)
- **Row shadow (hover/first):** `rgba(0,0,0,0.24) 0px 0px 1px 0px, rgba(0,0,0,0.24) 0px 1.5px 9px 0px`
- **Layout:** CSS Grid
- **Row label:** 14px, weight 400, color `#edeef2`
- **Row count (e.g. "16/16"):** 11px, weight 400, color `#e0e2eb`
- **Expand arrow:** SVG 16×16, color `#e7dff7`, fill none (stroke-based chevron)
- **Link icon:** SVG 16×16, color `#e7dff7`

#### Cell Values
- **Normal value:** 14px, weight 400, color `#edeef2`
- **Done count (green):** 14px, weight 400, color `#008000` — displayed as `/N` suffix (e.g. `56/12`)
- **Empty cell dash:** 14px, weight 400, color `#606781`
- **Cell padding:** 0 24px 0 0 (right-padded for the done count)

#### Total Row
- **Row bg:** `#373d50`
- **"Total" label:** 14px, weight 700, color `#edeef2`
- **Values:** 14px, weight 700, color `#edeef2`
- **Done count:** 14px, weight 700, color `#008000`

### Capacity View

#### Column Headers
- **Text:** 12px, weight 700, uppercase, text-transform, color `#e0e2eb`
- **Columns:** Team, Cap, Load, Buf, End, 2026-01 through 2026-06

#### Header Row
- **Bg:** `#373d50`, height 39px

#### Group Rows (Tasks, QA, Sound, Art, Archive)
- **Bg:** `#2a3042`, height 39px
- **Label:** 14px, weight 700, color `#edeef2`
- **Load value (overloaded):** 14px, weight 700, color `#c03942` (cherry)

#### Sub-Rows (individual decks)
- **Normal bg:** `#373d50`, height 39px
- **Overloaded bg:** `#400206` (dark red tint)
- **Deck name:** 14px, weight 400, color `#edeef2`
- **"n/a" placeholder:** 14px, weight 400, color `#c03942` (cherry)

---

## Key Measurements Summary
| Element | Value |
|---|---|
| Top nav height | 52px |
| Toolbar height | 60px |
| Row height (all) | 39px |
| Toggle button height | 34px |
| Milestone dropdown height | 32px |
| Base font size (body) | 16px |
| Column header font | 11-12px bold uppercase |
| Data cell font | 14px normal |
| Row label font | 14px normal |
| Group header font | 12px bold uppercase |
