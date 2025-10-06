# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

This is a lightweight TypeScript library for transliterating Serbian text between Cyrillic and Latin (Gaj's Latinica) alphabets. The library has zero dependencies and exports a single default function.

## Commands

### Testing

```bash
npm test          # Run tests in watch mode (using Vitest)
npm test -- --run # Run tests once without watch mode
```

### Build

```bash
npm run build     # Compile TypeScript to dist/ (ESM format with source maps)
```

### Formatting

```bash
npm run format    # Format all .ts and .md files with Prettier
```

### Pre-publish

```bash
npm run prepublishOnly  # Runs tests and build before publishing
```

## Architecture

### Core Implementation (src/index.ts)

The transliteration logic is based on two mapping dictionaries:

- `latinToCyrillicMap`: Maps Latin characters to Cyrillic (including digraphs dž→џ, lj→љ, nj→њ)
- `cyrillicToLatinMap`: Maps Cyrillic characters to Latin (including Љ→Lj, Њ→Nj, Џ→Dž)

Two pre-compiled regexes are used for performance:

- `latinRegex`: Matches Latin characters, sorted by length (longest first) to handle digraphs correctly
- `cyrillicRegex`: Matches Cyrillic characters

The default export function takes `(text: string, direction: Direction)` where `Direction = 'toLatin' | 'toCyrillic'`.

### Known Limitation: Ambiguous Digraphs

The library uses a simple rule-based replacement algorithm that cannot distinguish between:

- True digraphs (e.g., "nj" in "Njegoš" → "Његош")
- Adjacent separate letters (e.g., "nj" in "injekcija" → incorrectly becomes "ињекција" instead of "инјекција")

This is documented in the README and has a failing test in src/index.test.ts:133-167 that demonstrates the expected behavior. This is an intentional trade-off for simplicity.

### Package Configuration

The package is configured as **ESM-only** (`"type": "module"` in package.json):

- Main: `./dist/index.js` (ESM format)
- Types: `./dist/index.d.ts`
- Source maps: `./dist/index.js.map` (generated during build)

### Code Style

The project uses Prettier for formatting with these settings:

- Tabs (not spaces)
- Single quotes
- Semicolons
- No trailing commas
- 80 character line width

## Testing Approach

Tests are comprehensive and cover:

- Basic character conversion (both directions)
- Digraph handling
- Special Serbian characters (Đ, Ć, Ž, Č, Š)
- Case preservation
- Edge cases (empty strings, mixed scripts, round-trip conversion)
- Known failures for the ambiguous digraph problem (using `it.fails()`)
