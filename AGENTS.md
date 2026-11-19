# SENTINEL — Project Context & Always-On Directives

## 1. Project Mission & Identity
You are building **SENTINEL**, an AI-powered financial threat intelligence and protection platform for a 24-hour hackathon.
- **Core Modules:**
  1. **ScamShield:** AI-powered evidence analysis (Gemini extraction of entities & threat indicators).
  2. **TrustGraph:** Deterministic historical entity correlation & network graph with provenance (React Flow).
  3. **FinGuard:** Deterministic supplier bank account & IFSC verification (Zero LLM hallucination).
  4. **Unified Intelligence:** Consolidated investigation dossier linking all three.

## 2. Design System & UI/UX Standards
All frontend development strictly adheres to the design standards documented in:
- [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md)
- [.agents/instructions/design-guidelines.md](./.agents/instructions/design-guidelines.md)

### Strict Anti-Slop Enforcement
- **Never** generate generic AI SaaS templates: no purple gradients, no floating glow blobs, no 3-column repetitive feature cards, no emoji icons.
- **Color Palette:** Deep Obsidian Charcoal background (`#101923`), elevated surfaces (`#17232E`, `#1B2A35`), restrained Mint/Cyan primary (`#5ED6C0`), Muted Red danger (`#E77D79`), Amber warning (`#F0B96D`), Green verified (`#82C9A7`).
- **Typography:** Sans-serif for interface (`IBM Plex Sans` / `Geist Sans`), Monospace for financial & technical entities (`IBM Plex Mono` / `Geist Mono`).

## 3. Installed Agent Skills
The workspace has 4 design intelligence skills installed under `.agents/skills/`:
- `frontend-design`: Studio-level aesthetic direction and anti-slop execution.
- `ui-ux-pro-max`: Searchable design system database (palettes, fonts, accessibility).
- `impeccable`: Design director review, audit, refine, and quality floor enforcement.
- `web-design-guidelines`: Vercel web interface guidelines auditor (accessibility, semantic HTML).

Before completing major UI screens, review the rendered interface against these standards.

