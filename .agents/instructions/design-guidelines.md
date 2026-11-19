# SENTINEL — Persistent Project Design Instructions & UI/UX Standards

> **Visual Philosophy:** Industrial Financial Intelligence × Precision Investigation
> **Product Mandate:** Build a serious, high-craft financial threat intelligence and fraud defense interface. Zero generic AI SaaS templates, zero purple gradients, zero decorative slop.

---

## 1. Core Visual Principles & Anti-Slop Enforcements

### What SENTINEL Must Communicate
- **Forensic Rigor & Determinism:** Clear provenance for all findings. Visual distinction between observed facts vs. investigative leads.
- **Financial Precision:** Strict tabular layouts, monospaced numerals for currency/accounts/IFSC, side-by-side reconciliation diffs.
- **Cybersecurity Authority:** Deep navy/charcoal surfaces, crisp borders, restrained mint/cyan accent, clear severity hierarchy (Danger/Red, Warning/Amber, Success/Green, Muted/Slate).

### Prohibited Patterns (Strictly Banned)
- ❌ **No AI Slop Gradients:** No purple-to-blue or pink gradients on hero sections, buttons, or card backgrounds.
- ❌ **No Floating Glow Orbs / Blurred Colored Blobs:** Surfaces are clean, dark, and matte.
- ❌ **No SaaS-in-a-Box Clichés:** No 3-column identical rounded card grids repeated down every page.
- ❌ **No Fake Live Metrics / Gratuitous KPI Blocks:** If a number is not computed from actual investigation data, it does not exist.
- ❌ **No Inconsistent Geometries:** Border radii must follow the token scale (cards = 6px `rounded-md`, buttons/inputs = 4px `rounded`, badges = 2px `rounded-sm`).
- ❌ **No Emoji Icons:** Use standard Lucide SVGs with precise 14px/16px/18px stroke widths.
- ❌ **No Unlabeled Icon Buttons:** Every icon button must have `aria-label` and visible tooltip or text.

---

## 2. Color System & Design Tokens

SENTINEL uses a dark, data-dense palette engineered for high contrast and prolonged analyst focus.

```css
:root {
  /* Base Surfaces */
  --background: #101923;          /* Deep Obsidian Charcoal */
  --surface: #17232E;             /* Elevation 1: Main Container & Sidebars */
  --surface-elevated: #1B2A35;    /* Elevation 2: Cards, Modals & Floating Drawers */
  --surface-muted: #263A46;       /* Elevation 3: Hover states, Table headers */

  /* Text & Contrast */
  --foreground: #EAF0F2;          /* Primary Text (92% contrast) */
  --foreground-secondary: #A7B8C4;/* Metadata, descriptions, secondary labels */
  --foreground-muted: #718794;    /* Tertiary text, timestamps, subtle captions */

  /* Structural Dividers */
  --border: #2B3A45;              /* Default component border */
  --border-muted: #1E2D38;        /* Subtle inner separators */
  --border-highlight: #3A4E5C;    /* Active/Focus state border */

  /* Semantic Actions & Findings */
  --primary: #5ED6C0;             /* Restrained Cyber Mint - interactive accents */
  --primary-foreground: #0A1E1A;  /* High contrast text on primary buttons */
  --primary-muted: rgba(94, 214, 192, 0.12); /* Active state background */

  --danger: #E77D79;              /* Forensic Alert / Red - Confirmed Mismatch & BEC */
  --danger-muted: rgba(231, 125, 121, 0.14);

  --warning: #F0B96D;             /* Investigative Lead / Amber - Unverified Entity / Domain Match */
  --warning-muted: rgba(240, 185, 109, 0.14);

  --success: #82C9A7;             /* Verified Safe / Green - Trusted Account Match */
  --success-muted: rgba(130, 201, 167, 0.14);

  --info: #70B8FF;                /* Network Intelligence / Cyan-Blue */
  --info-muted: rgba(112, 184, 255, 0.14);
}
```

---

## 3. Typography Hierarchy

- **Interface Primary Font:** `IBM Plex Sans` or `Geist Sans` — neutral, humanist, highly legible at small sizes.
- **Technical & Financial Monospace:** `IBM Plex Mono` or `Geist Mono` — **mandatory** for:
  - Bank Account Numbers (e.g. `1111 2222 3333`)
  - IFSC & Routing Codes (e.g. `DEMO0001111`)
  - Domain Names & IP addresses (e.g. `asterion-supplies-billing.com`)
  - Entity IDs & Evidence Hash IDs
  - Timestamps (ISO 8601)

### Type Scale Rules
| Role | Size | Weight | Tracking / Leading | Usage |
| :--- | :--- | :--- | :--- | :--- |
| **H1 Display** | 24px (1.5rem) | 600 SemiBold | -0.02em / 1.2 | Page Header (single per view) |
| **H2 Section** | 18px (1.125rem) | 600 SemiBold | -0.01em / 1.3 | Panel Title, Major Card Header |
| **H3 Subheader** | 14px (0.875rem) | 600 SemiBold | 0 / 1.4 | Module Subsection, Drawer Title |
| **Body Default** | 14px (0.875rem) | 400 Regular | 0 / 1.5 | General descriptions, findings body |
| **Data / Table** | 13px (0.8125rem) | 400 / 500 Mono | 0 / 1.4 | Tabular data, bank accounts, identifiers |
| **Caption / Meta** | 11px (0.6875rem) | 500 Medium | +0.02em / 1.3 | Timestamps, badge labels, evidence IDs |

---

## 4. Workflows & Screen-Specific Archetypes

### A. Executive Dashboard (`/`)
- **Primary Goal:** Instant situational awareness.
- **Key Elements:**
  - Active Threat Alert banner (if BEC/invoice tampering detected).
  - High-density Investigation Ledger: Filterable table of past & active investigations with ID, target entity, threat level badge, timestamp, and status.
  - Quick Action: Clean, prominent `Start New Investigation` trigger.
  - Zero decorative sparklines or vanity metrics.

### B. New Investigation Studio (`/investigations/new`)
- **Primary Goal:** Low-friction multimodal ingestion.
- **Split Composition:**
  - Left: Evidence Dropzone (supports PDF invoice upload, screenshot image, or raw email text paste). Pre-loadable with the Asterion Technologies test scenario.
  - Right: Contextual configuration & Target Entity selector (Optional known supplier selection).
  - Real-time step progress indicator during extraction.

### C. TrustGraph Canvas (`/trustgraph` & Investigation View)
- **Primary Goal:** SENTINEL's signature investigative experience.
- **Canvas Features:**
  - Dark grid background (`#101923` with `#1B2A35` grid dots).
  - **Custom Node Hierarchy:**
    - Incident Nodes: Hexagonal / bold outline.
    - Organization Nodes: Rounded rectangle with building icon.
    - Email Nodes: Pill with `@` symbol.
    - Domain Nodes: Rectangular badge with globe icon.
    - Bank Account Nodes: Monospaced chip with vault icon.
    - Phone Nodes: Monospaced badge with phone icon.
  - **Provenance-Backed Edges:**
    - Labeled with relationship types: `MENTIONS`, `SENT_FROM`, `PAYMENT_TO`, `USES_DOMAIN`, `CONNECTED_TO`.
    - Dashed edges for historical correlations vs. Solid edges for direct evidence.
  - **Interactive Evidence Drawer:**
    - Clicking *any* node or edge slides out the right-hand inspection drawer showing supporting raw text, timestamp, and source document excerpt.

### D. FinGuard Verification (`/finguard` & Investigation View)
- **Primary Goal:** Deterministic, side-by-side payment protection.
- **Layout:**
  - Side-by-side reconciliation card:
    - Left column: **Registered Trusted Profile** (Account, IFSC, Legal Name, Status: VERIFIED).
    - Right column: **Extracted Invoice Profile** (Account, IFSC, Entity Name, Status: MISMATCH).
  - Discrepancy Alert callout in muted red (`--danger`) highlighting the altered digits and explaining the financial risk.
  - Action guidance: "Do Not Authorize Transfer — Contact Vendor Via Out-of-Band Verified Phone".

### E. Unified Investigation Intelligence Report (`/investigations/[id]`)
- **Primary Goal:** Single comprehensive intelligence dossier for C-suite and finance teams.
- **Sections:**
  1. Executive Summary & Calculated Risk Level (Critical / High / Medium / Low).
  2. ScamShield Detection Findings (Qualitative cues: urgency, impersonation, subtle domain typo).
  3. TrustGraph Network Topology (Embedded interactive mini-graph + link to fullscreen).
  4. FinGuard Payment Discrepancy Breakdown (Exact mismatched bank/IFSC numbers).
  5. Actionable Mitigation Checklist.

---

## 5. Frontend Engineering & Quality Floor

- **Keyboard Navigation:** All interactive elements (`button`, `a`, input fields, graph nodes) must have visible focus rings (`ring-1 ring-primary ring-offset-1 ring-offset-background`).
- **Semantic HTML:** Always use `<button>` for actions, `<a>` for links, `<table>` for tables. Never use `<div onClick>`.
- **Contrast Ratios:** Text must satisfy WCAG AA (minimum 4.5:1 against surfaces).
- **Reduced Motion:** Wrap all CSS transitions in `@media (prefers-reduced-motion: no-preference)` or use Tailwind `motion-safe:`.
- **Visual QA Protocol:**
  1. Run application and verify on Desktop (1440px), Laptop (1280px), and Tablet (768px).
  2. Inspect typography scaling and avoid horizontal scrollbars.
  3. Verify empty, loading (skeleton), and error states for all API calls.

