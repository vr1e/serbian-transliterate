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
- **Lightweight**: Tiny footprint, perfect for web and Node.js projects.
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
