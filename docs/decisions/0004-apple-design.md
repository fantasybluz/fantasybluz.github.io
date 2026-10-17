# 0004 Restyle after Apple's design language (DESIGN.md from getdesign)

- Status: Accepted
- Date: 2026-10-16

## Context

The site had a dark neon theme with a meteor and glow-orb background (`219da39`). There was no written spec, so each
change picked its own colors and spacing.

## Decision

Follow Apple's design language, written down in `DESIGN.md` (`npx getdesign@latest add apple`) and read before any UI
change (`2126172`):

- Thin translucent black nav bar; a full-screen menu on phones
- Sections alternate white, parchment (`#f5f5f7`), and black; the meteor and glow background are gone
- A single accent, Action Blue (`#0066cc`): pill buttons in the hero and contact, blue text links elsewhere
- Cards on contrasting surfaces with an 18px radius, no borders or shadows; skills and credentials pack into columns
- The link-preview cards follow the same spec ([ADR 0005](0005-per-locale-og-cards.md))

## Trade-offs

- `DESIGN.md` describes Apple's marketing site (562 lines, SF Pro, product photography); only part of it applies to a
  text-heavy resume, so judgement is still needed
- One accent color means no colour coding for categories (skills, projects); grouping is by layout only
- A big CSS rewrite (`src/App.css` changed by about 1,700 lines); older screenshots of the site no longer match
