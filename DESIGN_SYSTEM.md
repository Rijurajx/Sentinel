# SENTINEL Design System Specification

**Version:** 1.0.0  
**Classification:** Financial Threat Intelligence & Cybersecurity Platform  
**Target Surface:** Enterprise Investigation & Accounts Payable Protection  

---

## 1. Design Philosophy

SENTINEL operates at the intersection of **Industrial Financial Intelligence** and **Forensic Investigation**.

Financial fraud occurs when critical indicators are obscured by visual noise and disconnected workflows. SENTINEL’s design language solves this by upholding four core values:

1. **Forensic Provenance First:** No relationship, score, or entity is shown without an accessible line of evidence. The user must be able to click any node, discrepancy, or alert and view the underlying raw document excerpt and timestamp.
2. **Deterministic Clarity:** Financial details (bank accounts, IFSC codes, amounts) are treated with mathematical rigor. Discrepancies are highlighted with high visual weight, contrasting registered truth against incoming claims.
3. **Restraint Over Decoration:** Security analysts work long hours under cognitive load. Visuals must be calm, matte, dark, and high-contrast, free from floating gradients, decorative glow effects, or superficial AI marketing cards.
4. **Information Density with Breathing Room:** Dense data tables and technical graphs must remain legible through deliberate typographic scale, structured borders, and generous cell padding.

---

## 2. Visual Identity

- **Atmosphere:** Deep Obsidian & Slate. Matte, dark, structural, and authoritative.
- **Accent:** Restrained Mint / Cyan (`#5ED6C0`) signaling active intelligence and navigation.
- **Structural Geometry:** Sharp, subtle borders (`#2B3A45`) with small, consistent border radii (2px to 6px) that convey engineering precision.
- **Audio-Visual Tone:** Silent, responsive, and tactile.

---

## 3. Color Tokens

All colors are specified as CSS custom properties with dedicated semantic mappings:

```css
:root {
  /* Surfaces & Canvas */
  --bg-app: #101923;              /* Primary Application Canvas */
  --surface-base: #17232E;        /* Standard Surface: Sidebars, Page Sections */
  --surface-card: #1B2A35;        /* Elevated Surface: Cards, Panels, Drawers */
  --surface-active: #233442;      /* Interactive / Active / Hover Item */
  --surface-muted: #131E28;       /* Recessed / Code block background */

  /* Text & Contrast */
  --text-primary: #EAF0F2;        /* High-contrast body & headers (14:1 ratio) */
  --text-secondary: #A7B8C4;      /* Metadata, subtitles, column headers */
  --text-muted: #718794;          /* Timestamps, disabled states, captions */

  /* Structural Borders */
  --border-subtle: #1E2D38;       /* Row dividers, secondary boundaries */
  --border-default: #2B3A45;      /* Card borders, input field outlines */
  --border-strong: #3D5262;       /* Focus rings, highlighted nodes */

  /* Semantic State Tokens */
  --accent-cyan: #5ED6C0;         /* Primary brand accent / interactive focus */
  --accent-cyan-bg: rgba(94, 214, 192, 0.12);

  --status-danger: #E77D79;       /* Critical BEC, Mismatched Payee, Phishing */
  --status-danger-bg: rgba(231, 125, 121, 0.14);
  --status-danger-border: rgba(231, 125, 121, 0.35);

  --status-warning: #F0B96D;      /* Unregistered Domain, Urgent Demands */
  --status-warning-bg: rgba(240, 185, 109, 0.14);
  --status-warning-border: rgba(240, 185, 109, 0.35);

  --status-success: #82C9A7;      /* Verified Supplier, Authenticated Account */
  --status-success-bg: rgba(130, 201, 167, 0.14);
  --status-success-border: rgba(130, 201, 167, 0.35);

  --status-info: #70B8FF;         /* Graph Link, Incident Association */
  --status-info-bg: rgba(112, 184, 255, 0.14);
  --status-info-border: rgba(112, 184, 255, 0.35);
}
```

---

## 4. Typography

### Primary Font: `IBM Plex Sans` (or `Geist Sans`)
Used for all UI copy, navigation, buttons, and form labels.
- Weights: Regular (`400`), Medium (`500`), SemiBold (`600`).

### Monospace Font: `IBM Plex Mono` (or `Geist Mono`)
**Mandatory** for all technical and financial tokens:
- Bank Account numbers (`1111 2222 3333`)
- IFSC codes (`DEMO0001111`)
- Invoice numbers (`INV-2024-8902`)
- IP addresses, domains, hashes, and timestamps.

### Typographic Hierarchy
| Hierarchy | Element | Size | Weight | Line Height | Tracking |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Page Title** | `h1` | 24px (`1.5rem`) | 600 SemiBold | 1.25 | -0.02em |
| **Section Header** | `h2` | 18px (`1.125rem`)| 600 SemiBold | 1.3 | -0.01em |
| **Card / Drawer Title** | `h3` | 15px (`0.9375rem`)| 600 SemiBold | 1.4 | 0 |
| **Body Primary** | `p`, `span` | 14px (`0.875rem`) | 400 Regular | 1.5 | 0 |
| **Body Small** | `span`, `div` | 13px (`0.8125rem`)| 400 Regular | 1.4 | 0 |
| **Data Monospace** | `code`, `pre` | 13px (`0.8125rem`)| 500 Medium | 1.4 | 0 (tabular) |
| **Meta / Badge** | `span` | 11px (`0.6875rem`)| 500 Medium | 1.2 | +0.02em |

---

## 5. Spacing Scale

Strict adherence to a 4px/8px modular grid:
- `space-1`: 4px
- `space-2`: 8px (standard element spacing)
- `space-3`: 12px (form input padding, badge padding)
- `space-4`: 16px (card inner padding, standard gap)
- `space-6`: 24px (section padding, card outer gap)
- `space-8`: 32px (page margins, large module separation)
- `space-12`: 48px (major layout dividing space)

---

## 6. Border Radii

Strict geometric scale avoiding overly rounded bubble shapes:
- `radius-sm`: 2px (badges, status tags, pill tags)
- `radius-md`: 4px (buttons, input fields, dropdown menus)
- `radius-lg`: 6px (cards, modal containers, graph canvas border)
- `radius-xl`: 8px (drawers, large dialog shells)
- *Circles (`rounded-full`) are reserved exclusively for avatar initials and graph node anchor ports.*

---

## 7. Shadows & Elevation

In dark mode, spatial depth is established through **surface luminosity and border contrast**, never through heavy dark drop shadows:
- **Level 0 (Canvas):** `--bg-app` (`#101923`), no shadow.
- **Level 1 (Panels):** `--surface-base` (`#17232E`), border `1px solid var(--border-default)`.
- **Level 2 (Cards):** `--surface-card` (`#1B2A35`), border `1px solid var(--border-default)`, shadow: `0 2px 4px rgba(0, 0, 0, 0.3)`.
- **Level 3 (Modals & Drawers):** `--surface-card`, border `1px solid var(--border-strong)`, shadow: `0 8px 24px rgba(0, 0, 0, 0.6)`.

---

## 8. Component Variants

### Buttons
- **Primary:** Background `var(--accent-cyan)`, text `#0A1E1A` (SemiBold), hover: brightness 1.08, active: scale 0.99.
- **Secondary:** Background `var(--surface-card)`, border `1px solid var(--border-default)`, text `var(--text-primary)`, hover: `var(--surface-active)`.
- **Destructive:** Background `var(--status-danger-bg)`, border `1px solid var(--status-danger-border)`, text `var(--status-danger)`.
- **Ghost:** Background transparent, text `var(--text-secondary)`, hover: `var(--surface-base)`.

### Inputs & Selectors
- Background: `var(--surface-muted)`.
- Border: `1px solid var(--border-default)`.
- Focus: `border-color: var(--accent-cyan)`, ring: `2px solid var(--accent-cyan-bg)`.
- Typography: 13px, font-family: IBM Plex Sans.

### Badges & Severity Chips
- Format: `[Status Indicator Dot] [LABEL]`
- `CRITICAL`: Background `var(--status-danger-bg)`, border `var(--status-danger-border)`, text `var(--status-danger)`.
- `WARNING`: Background `var(--status-warning-bg)`, border `var(--status-warning-border)`, text `var(--status-warning)`.
- `VERIFIED`: Background `var(--status-success-bg)`, border `var(--status-success-border)`, text `var(--status-success)`.
- `OBSERVED`: Background `var(--status-info-bg)`, border `var(--status-info-border)`, text `var(--status-info)`.

---

## 9. Navigation Patterns

- **Top Application Shell:**
  - Left: SENTINEL monogram + wordmark (`SENTINEL // FINANCIAL THREAT INTELLIGENCE`).
  - Center/Nav: `Dashboard`, `New Investigation`, `TrustGraph Canvas`, `FinGuard Suppliers`.
  - Right: System Status indicator (`ENGINE ACTIVE`, live latency / environment badge) + Quick Action button.
- **Contextual Sidebars:**
  - 280px fixed width for sub-navigation or filter criteria.

---

## 10. Table Styles (FinGuard & Investigation Ledger)

- **Container:** Bordered container with header separated by `1px solid var(--border-default)`.
- **Header:** Background `var(--surface-base)`, text `var(--text-secondary)` (uppercase, 11px, tracking 0.05em, font-weight 600).
- **Row:** Height 44px, border-bottom `1px solid var(--border-subtle)`. Hover state: `background-color: var(--surface-active)`.
- **Alignment:** Financial values and accounts right-aligned in monospace. Status badges center-aligned.

---

## 11. Status Indicators

- **Pulsing Dot:** 6px circle with a subtle 2s pulse animation for active analysis.
- **Reconciliation Diff Banner:**
  - Red background tint with side-by-side comparison:
    ```
    REGISTERED: [DEMO0001111] (Asterion Supplies Pvt Ltd)
    EXTRACTED:  [DEMO0002222] (SUSPICIOUS NEW ROUTING DETECTED)
    ```

---

## 12. TrustGraph Visualization Conventions

The graph visualizer is built on **React Flow** with custom nodes engineered for readability:

### Node Archetypes
1. **Incident Node (`incident`):**
   - Shape: Hexagonal / Chamfered card.
   - Accent: Blue/Purple outline (`#70B8FF`).
   - Content: Incident Title, date, incident ID.
2. **Organization Node (`organization`):**
   - Shape: Rounded rectangle (`rounded-md`).
   - Accent: Slate border with Building icon.
   - Content: Company legal name, verified domain badge.
3. **Payee / Bank Account Node (`bank_account`):**
   - Shape: Vault chip with gold/amber border if mismatched, green if trusted.
   - Content: Monospaced account number + IFSC code.
4. **Domain Node (`domain`):**
   - Shape: Compact pill with Globe icon.
   - Accent: Amber outline if flagged in prior campaign.
5. **Phone / Email Nodes (`communication`):**
   - Shape: Pill badge with `@` or Phone icon.

### Edge Archetypes
- **Observed Direct Evidence:** Solid stroke (`2px solid #5ED6C0`), labeled with edge type (`SENT_FROM`, `PAYMENT_TO`).
- **Historical Association:** Dashed stroke (`2px dashed #F0B96D`), animated particle flow indicating correlation.

### Provenance Drawer
- Clicking any node or edge opens the **Right Inspection Drawer (380px)** displaying:
  - Source Document link.
  - Raw evidence excerpt.
  - Extraction confidence.
  - Observation status (`CONFIRMED_OBSERVATION` vs `CORRELATED_LEAD`).

---

## 13. Responsive Behavior

- **Desktop (1440px+):** Full split-pane workspace (Investigation summary + interactive canvas + evidence stream).
- **Laptop (1024px–1439px):** Balanced sidebar and responsive canvas with collapsible inspector.
- **Tablet (768px–1023px):** Stacked vertical layout: graph canvas on top (400px height), drawer docks to bottom sheet.
- **Mobile (<768px):** Tabbed interface toggling between `Analysis Findings`, `Graph View`, and `FinGuard Checks`.

---

## 14. Motion Principles

- **Duration:** Never exceed 250ms for UI state changes.
- **Easing:** `cubic-bezier(0.16, 1, 0.3, 1)` (snappy ease-out).
- **Triggers:** Motion is only used in direct response to user interaction (opening a drawer, hovering an edge, clicking node).
- **Reduced Motion:** When `prefers-reduced-motion` is active, animations immediately fall back to instantaneous transitions (`0ms`).

---

## 15. Accessibility Requirements (WCAG 2.1 AA)

- All icon buttons must provide an explicit `aria-label`.
- All form inputs must have associated `<label>` tags.
- Keyboard focus is visibly rendered with `ring-2 ring-primary ring-offset-2 ring-offset-background`.
- Error messages must be declared with `role="alert"` and `aria-live="polite"`.
- Tab order flows logically from evidence upload to analysis findings.

---

## 16. Correct vs. Incorrect UI Decisions

| Feature | ❌ Anti-Slop / Bad Decision | ✅ Correct SENTINEL Decision |
| :--- | :--- | :--- |
| **Hero Section** | Giant centered text "The Future of AI Fraud Protection" with purple gradient button | Compact incident banner with active investigation status and "Start Analysis" |
| **Bank Account Display**| Unstyled regular text: `111122223333` | Monospaced chunked text: `1111 2222 3333` with copy button and mismatch diff |
| **TrustGraph Nodes** | Generic circular bubbles with no icons and no evidence labels | Rich custom cards displaying entity type, normalized value, and supporting evidence count |
| **Alerts** | Floating toast saying "Something went wrong" | In-situ callout explaining the exact IFSC mismatch: "IFSC DEMO0002222 does not match registered DEMO0001111" |
| **Icons** | 🚀 ⚠️ 💸 Emoji sprinkled across cards | Precision 16px Lucide SVG icons (`ShieldAlert`, `Network`, `Building2`, `Landmark`) |

