# Serbian transliterate

[![npm version](https://img.shields.io/npm/v/serbian-transliterate.svg)](https://www.npmjs.com/package/serbian-transliterate)
[![npm downloads](https://img.shields.io/npm/dm/serbian-transliterate.svg)](https://www.npmjs.com/package/serbian-transliterate)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://github.com/vr1e/serbian-transliterate/blob/main/LICENSE.md)

A simple, lightweight, and robust utility for transliterating Serbian text between the Cyrillic (ћирилица) and Latin (latinica) alphabets.

```javascript
transliterate('Здраво!', 'toLatin'); // -> 'Zdravo!'
transliterate('Beograd', 'toCyrillic'); // -> 'Београд'
```

## Features

- **Zero Dependencies**: A single, dependency-free function.
- **Lightweight**: About 1 KB minified and gzipped, perfect for web and Node.js projects.
- **Fast**: A single table-driven pass, 5–8× faster than the alternative (see [Performance](#performance)).
- **Accurate**: Correctly handles all standard Serbian characters, including digraphs (lj, nj, dž).
- **Robust**: Preserves capitalization, numbers, punctuation, and non-Serbian characters.
- **TypeScript Support**: Written in TypeScript with full type definitions included.

## Installation

```bash
npm install serbian-transliterate
```

## Usage

The package exports a single default function that takes the text and the target direction as arguments.

```javascript
import transliterate from 'serbian-transliterate';

// Cyrillic to Latin
const latinText = transliterate('Здраво Свете!', 'toLatin');
console.log(latinText); // -> 'Zdravo Svete!'

const latinWithDigraphs = transliterate('Љубав, Његош, Џез', 'toLatin');
console.log(latinWithDigraphs); // -> 'Ljubav, Njegoš, Džez'

// Latin to Cyrillic
const cyrillicText = transliterate('Beograd, Srbija', 'toCyrillic');
console.log(cyrillicText); // -> 'Београд, Србија'

const cyrillicWithDigraphs = transliterate(
	'Ljubazni dabar Džordž.',
	'toCyrillic'
);
console.log(cyrillicWithDigraphs); // -> 'Љубазни дабар Џорџ.'
```

## API

```typescript
transliterate(text: string, direction: 'toLatin' | 'toCyrillic'): string
```

**Parameters:**

- `text` - The text to transliterate
- `direction` - Either `'toLatin'` (Cyrillic → Latin) or `'toCyrillic'` (Latin → Cyrillic)

**Returns:** The transliterated string

## Performance

Operations per second on a ~1 KB paragraph of Serbian prose, compared with [`serbian-transliteration`](https://www.npmjs.com/package/serbian-transliteration), the other bidirectional Serbian transliterator on npm. Both libraries produce identical output on this text.

| Direction  | serbian-transliterate | serbian-transliteration |  Speedup |
| ---------- | --------------------: | ----------------------: | -------: |
| toLatin    |         127,500 ops/s |            16,700 ops/s | **7.6×** |
| toCyrillic |          93,500 ops/s |            19,900 ops/s | **4.7×** |

Absolute numbers depend on the machine; the ratio is the more portable figure. Measured on an Apple M1 Pro with Node 22.15. Reproduce with `npm run bench`.

Size: 1.04 KB minified and gzipped, with no dependencies. CI enforces the budget with [size-limit](https://github.com/ai/size-limit); check it with `npm run size`.

## Known Limitations

### Ambiguous Digraphs (The "injekcija" problem)

This utility uses a simple, rule-based replacement algorithm. It cannot distinguish between a true digraph (like nj in Njegoš) and two separate letters that happen to be adjacent (like n and j in injekcija).

- **injekcija** will be incorrectly transliterated to **ињекција** instead of the correct **инјекција**.
- **konjugacija** will be incorrectly transliterated to **коњугација** instead of the correct **конјугација**.

This is a known trade-off made to keep the library simple and fast. For the vast majority of Serbian words, this is not an issue.

## Contributing

Contributions are welcome! If you find a bug or have a suggestion, please open an issue on the [GitHub repository](https://github.com/vr1e/serbian-transliterate/issues).

## License

This project is licensed under the MIT License. See the [LICENSE](https://github.com/vr1e/serbian-transliterate/blob/main/LICENSE.md) file for details.
