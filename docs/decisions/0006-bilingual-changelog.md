# 0006 Version number and a changelog in two files, no NEW badge

- Status: Accepted
- Date: 2026-10-17

## Context

Visitors had no way to see what changed or which version they were looking at. The site has two languages, so a
changelog page is needed at `/changelog/` and `/en/changelog/`. cocktail-party and portal already show a version with
a NEW badge stored in `localStorage`.

Options for the text: one file with both languages per bullet, or one file per language.

## Decision

- `VERSION` + `CHANGELOG.md` (zh) + `CHANGELOG.en.md` (en), written back from the git history as 1.0.0 to 2.0.0
  (`9f90935`), then 2.1.0 for the footer link itself (`02877a0`)
- Two files, same releases and dates: each reads as a normal changelog, and a translator edits one language without
  touching the other. `checkChangelogs()` in `src/changelog.ts` fails the build if `VERSION` is not the newest release,
  versions are not `x.y.z` newest first, a release has no date or items, or the two files list different releases
- Headings are `## x.y.z - YYYY-MM-DD`; only `- ` bullets are shown, so the files can carry notes for the maintainer
- The footer shows `v<VERSION> · 更新紀錄` / `v<VERSION> · Changelog`; both changelog pages are prerendered with their own
  canonical and `hreflang`, and listed in the sitemap
- **No NEW badge.** The site has no repeat-visit flow to nudge (visitors come from a link or a search, mostly once),
  and a badge depends on `localStorage`, which the prerendered HTML cannot know, so it would flash in after hydration
- Steps and bump rules: [RELEASING.md](../../RELEASING.md)

## Trade-offs

- Every visible change is written twice; the build only checks versions and dates, not that the bullets say the same
- The changelog is bundled into the JS (`?raw` imports), so it grows with each release
- A returning visitor is not told there is something new
