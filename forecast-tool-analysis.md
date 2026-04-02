# Codecks Forecast Tool — UI & Data Model Analysis

## Overview

The Codecks Forecast tool is a project planning/tracking matrix that helps game development teams visualize workload distribution across **feature scopes** (rows) and **task type decks** (columns). It has two primary views: **Scope** and **Capacity**.

---

## 1. Scope View

The default view. A large cross-reference table showing how many cards (tasks) exist at the intersection of each scope and each deck.

### Layout

| Element | Description |
|---|---|
| **Rows** | Feature scopes (e.g., "Perks", "Enemies", "Tiles", "Items", etc.) — these are logical groupings of game features |
| **Columns** | Task type decks, grouped under team headers |
| **Column Groups** | TASKS, QA, SOUND, ART, ARCHIVE — each contains multiple sub-columns |
| **Cell Values** | Integer count of cards matching that scope + deck combination |
| **Total Row** | Bottom row summing all values per column |
| **Total Column** | Rightmost column summing all values per row |

### Column Groups and Sub-Columns (observed)

- **TASKS**: Code Tasks, Script & Tuning Tasks, Writing Tasks, Feedback Inbox, Tech Art Tasks, Game Design Tasks, Animation Tasks
- **QA**: CE2 Bugs Inbox
- **SOUND**: UI Sounds, CE2 Music, Ambient Sounds, Combat Sounds
- **ART**: Location Art, Map Art, Art Direction, Character Art, CE2 Art Requests
- **ARCHIVE**: Event Polish Tasks

### Row Details

Each row label shows:
- **Scope name** (e.g., "Enemies")
- **Completion count** in format `X/Y` (e.g., "29/29" meaning 29 out of 29 cards completed)
- **Link icon** (external link arrow) — navigates to the corresponding deck view

### Cell Value Format

- Most cells show a plain integer (e.g., `196`, `29`, `60`)
- Some cells show a **dual value** like `56/12` — this appears to represent `total/completed` or `total/remaining` (visible in the Animation Tasks column for Enemies, and in the Total row as `127/15`)
- Empty cells show a dash `-`
- Some cells show `0` explicitly (e.g., Ailments row has a `0` in Feedback Inbox and `0` in Animation Tasks columns)

### Expandable Rows

Clicking the chevron `>` next to a scope name expands it to reveal **individual cards** within that scope. Each card shows:
- A **status indicator** (green checkmark for completed cards)
- The **card title** (e.g., "#perk Silent Hunter", "#perk Uses X weapon at one level higher")
- Per-card values distributed across the same columns
- A `+` button appears on the expanded scope header to add new cards

---

## 2. Capacity View

Switched via the "Capacity" toggle. Shows a **team-centric** view focused on workload and timeline.

### Layout

| Column | Description |
|---|---|
| **TEAM** | Team/deck name (hierarchical: team group → individual decks) |
| **CAP** | Capacity — currently all show `0` (likely needs configuration) |
| **LOAD** | Total work load (number of cards/effort units) — shown in red when exceeding capacity |
| **BUF** | Buffer — calculated as percentage of load (controlled by slider) |
| **END** | Projected end date — shows `n/a` when capacity is 0 |
| **Monthly columns** | 2026-01 through 2026-06 — showing planned work distribution per month |

### Row Structure

- **Team group headers** (Tasks, QA, Sound, Art, Archive) — highlighted rows with aggregated totals
- **Individual decks** under each team group (e.g., Code Tasks, Script & Tuning Tasks under Tasks)
- **Expandable to show team members** — expanding a deck row reveals individual people (e.g., "muuutsch", "Riad") with their per-month capacity allocations shown as green editable values

### Buffer Slider

A slider at the top labeled "20% Buffer" allows adjusting the buffer percentage. The BUF column values are calculated as `LOAD * buffer%`.

---

## 3. Toolbar Controls

| Control | Behavior |
|---|---|
| **Scope / Capacity toggle** | Switches between the two views |
| **Milestone picker** ("None" dropdown) | "PICK MILESTONE" — searchable dropdown to filter by milestone |
| **Priority filters** (Low / Medium / High) | Toggle buttons with chevron icons. Clicking one filters to show only cards of that priority. Active filter is highlighted in teal. Columns with no matching cards for the selected priority are hidden. An `x` button appears to deselect. |
| **Close button** (X) | Top-right, closes the forecast overlay |

### Priority Filter Behavior

- Clicking a priority filter (e.g., "Medium") shows only cards with that priority level
- Columns that have zero cards for the selected priority are **completely hidden** from the table
- The Total row and Total column recalculate to reflect the filtered data
- Multiple filters appear to be selectable (toggle on/off independently)

---

## 4. API & Data Model

### API Endpoint

- **URL**: `https://api.codecks.io/` (POST)
- **Query format**: Custom GraphQL-like syntax (not standard GraphQL)

### Key Entities

| Entity | Description |
|---|---|
| **Account** | Top-level org (UUID: `14c3021c-95ad-11e9-b939-5368e19a8f5e`) |
| **Deck** | A column in the forecast — represents a task type/team bucket (identified by UUID) |
| **WorkflowItem** | Individual cards/tasks — the items counted in each cell |
| **Scope** | A row in the forecast — represents a feature grouping |
| **Priority** | Values `"a"` (High), `"b"` (Medium), `"c"` (Low) |

### Query Structure

The API queries `workflowItems` with these filters:
- `deckId`: Array of deck UUIDs (the columns)
- `priority`: Array of priority codes (e.g., `["b", "a"]` for Medium and High)
- `visibility`: `"default"`

The response returns arrays of workflowItem UUIDs matching the filters.

### Observed Deck UUIDs (columns)

Multiple deck UUIDs are passed in the query, each corresponding to a column in the forecast table (Code Tasks, Script & Tuning Tasks, etc.).

---

## 5. Visual Design Notes

- **Dark theme** background (`#1a1d2e`-ish navy/dark blue)
- **Column headers** are rotated/angled text with a small colored dot (red/green) prefix indicating deck color
- **Team group headers** (TASKS, QA, SOUND, ART, ARCHIVE) span across their sub-columns
- **Row hover** — subtle highlight on hover
- **Sticky elements** — the header row and possibly the Scope column appear sticky during scroll
- **Total row** is visually distinct (slightly different background)
- **Red text** for LOAD values in Capacity view when exceeding capacity
- **Green badges** for editable capacity values per team member in monthly columns
- **Completion indicators** — green checkmarks on individual cards in expanded scope view

---

## 6. Key Behaviors for Rebuild

1. **Cross-reference matrix**: The core is a scope (rows) × deck (columns) matrix with aggregated card counts
2. **Hierarchical columns**: Columns grouped under team headers
3. **Expandable rows**: Both views support drill-down (Scope → individual cards, Capacity → team members)
4. **Priority filtering**: Dynamic column visibility based on priority selection
5. **Milestone filtering**: Optional filter by milestone
6. **Dual values**: Some cells show split values (possibly total/done)
7. **Capacity planning**: Buffer calculation, monthly distribution, projected end dates
8. **Real-time aggregation**: Totals recalculate when filters change
9. **Navigation links**: Each scope row links to its deck view
10. **Inline editing**: In Capacity view, team member monthly allocations appear to be editable (green badges)
