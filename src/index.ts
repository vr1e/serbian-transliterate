/**
 * The direction of the transliteration. Can be 'toLatin' or 'toCyrillic'.
 */
type Direction = 'toLatin' | 'toCyrillic';

/**
 * @internal
 * The Serbian alphabet, letter for letter in both scripts (uppercase; lowercase is derived).
 */
const latinAlphabet =
	'A B V G D Đ E Ž Z I J K L Lj M N Nj O P R S T Ć U F H C Č Dž Š'.split(' ');
const cyrillicAlphabet = 'АБВГДЂЕЖЗИЈКЛЉМНЊОПРСТЋУФХЦЧЏШ';

/**
 * @internal
 * Lookup tables indexed by UTF-16 code unit. Pre-filled so V8 keeps them packed
 * instead of sparse; every mapped character is below U+0500.
 */
const cyrillicTable: (string | undefined)[] = new Array(0x500).fill(undefined);
const latinTable: (string | undefined)[] = new Array(0x500).fill(undefined);

/**
 * @internal
 * Two-letter Latin keys (lj, Nj, DŽ…) indexed by first, then second code unit,
 * so letters that never start a digraph skip the second lookup.
 */
const latinDigraphs: (Record<number, string> | undefined)[] = [];

const addLatin = (latin: string, cyrillic: string) => {
	if (latin.length === 1) {
		latinTable[latin.charCodeAt(0)] = cyrillic;
	} else {
		const first = latin.charCodeAt(0);
		latinDigraphs[first] = {
			...latinDigraphs[first],
			[latin.charCodeAt(1)]: cyrillic
		};
	}
};

latinAlphabet.forEach((latin, i) => {
	const cyrillic = cyrillicAlphabet[i];
	const lower = cyrillic.toLowerCase();
	cyrillicTable[cyrillic.charCodeAt(0)] = latin;
	cyrillicTable[lower.charCodeAt(0)] = latin.toLowerCase();
	addLatin(latin, cyrillic);
	addLatin(latin.toUpperCase(), cyrillic); // LJ, NJ, DŽ
	addLatin(latin.toLowerCase(), lower);
});

// Unicode single-character digraphs (U+01C4–U+01CC) and non-Serbian Latin letters
'ǄǅǆǇǈǉǊǋǌWwYyQq'
	.split('')
	.forEach((latin, i) => addLatin(latin, 'ЏЏџЉЉљЊЊњВвИиКк'[i]));
addLatin('X', 'Кс');
addLatin('x', 'кс');

/**
 * @internal
 * Single left-to-right scan; digraphs are tried before single letters, and
 * unmapped runs are copied in one slice rather than character by character.
 */
const convert = (
	text: string,
	table: (string | undefined)[],
	digraphs?: (Record<number, string> | undefined)[]
) => {
	let out = '';
	let last = 0;
	for (let i = 0; i < text.length; i++) {
		const code = text.charCodeAt(i);
		let mapped = table[code];
		if (mapped === undefined) continue;
		const pair = digraphs?.[code]?.[text.charCodeAt(i + 1)];
		out += text.slice(last, i);
		if (pair !== undefined) {
			mapped = pair;
			i++;
		}
		out += mapped;
		last = i + 1;
	}
	return out + text.slice(last);
};

/**
 * Transliterates a string between Serbian Cyrillic and Latin alphabets.
 *
 * @param text The input string to transliterate.
 * @param direction The direction of the conversion, either 'toLatin' or 'toCyrillic'.
 * @returns The transliterated string.
 *
 * @example
 * ```
 * import transliterate from 'serbian-transliterate';
 *
 * const latin = transliterate('Здраво Свете!', 'toLatin');
 * // -> 'Zdravo Svete!'
 *
 * const cyrillic = transliterate('Zdravo Svete!', 'toCyrillic');
 * // -> 'Здраво Свете!'
 * ```
 */
export default (text: string, direction: Direction) => {
	if (direction === 'toLatin') {
		return convert(text, cyrillicTable);
	}
	// NFC so e.g. Z + U+030C (combining caron) matches the precomposed Ž key
	return convert(text.normalize('NFC'), latinTable, latinDigraphs);
};
