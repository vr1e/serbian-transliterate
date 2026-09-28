# serbian-transliterate

Serbian Cyrillic ↔ Latin transliteration; the whole library is `src/index.ts`.

- `npm test` runs Vitest in watch mode and never exits; use `npm test -- --run`.
- The `'injekcija'` test is `it.fails()` on purpose: it pins the ambiguous-digraph limitation (see README). If you fix the limitation, change it to `it()`, or the suite fails once it passes.
- `lj`/`Lj`/`LJ` (and nj, dž) map to one letter; mixed forms like `nJ` or `dŽ` stay two letters, and a test pins that.
- README performance numbers are pasted in by hand from `npm run bench` (CI doesn't run it). Re-run and update them, including the machine line, whenever `src/index.ts` changes.
- Releases: `npm version <patch|minor|major>` then `git push --follow-tags`; `release.yml` publishes to npm (trusted publishing) on the `v*` tag. Don't `npm publish` locally.
