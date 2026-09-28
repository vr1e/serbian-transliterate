/**
 * The direction of the transliteration. Can be 'toLatin' or 'toCyrillic'.
 */
type Direction = 'toLatin' | 'toCyrillic';

/**
 * @internal
 * Mapping of Latin characters and digraphs to their Cyrillic counterparts.
 */
const latinToCyrillicMap: { [key: string]: string } = {
	DŽ: 'Џ',
	Dž: 'Џ',
	dž: 'џ',
	LJ: 'Љ',
	Lj: 'Љ',
	lj: 'љ',
	NJ: 'Њ',
	Nj: 'Њ',
	nj: 'њ',
	// Unicode single-character digraphs (U+01C4–U+01CC)
	Ǆ: 'Џ',
	ǅ: 'Џ',
	ǆ: 'џ',
	Ǉ: 'Љ',
	ǈ: 'Љ',
	ǉ: 'љ',
	Ǌ: 'Њ',
	ǋ: 'Њ',
	ǌ: 'њ',
	A: 'А',
	B: 'Б',
	V: 'В',
	G: 'Г',
	D: 'Д',
	Đ: 'Ђ',
	E: 'Е',
	Ž: 'Ж',
	Z: 'З',
	I: 'И',
	J: 'Ј',
	K: 'К',
	L: 'Л',
	M: 'М',
	N: 'Н',
	O: 'О',
	P: 'П',
	R: 'Р',
	S: 'С',
	T: 'Т',
	Ć: 'Ћ',
	U: 'У',
	F: 'Ф',
	H: 'Х',
	C: 'Ц',
	Č: 'Ч',
	Š: 'Ш',
	a: 'а',
	b: 'б',
	v: 'в',
	g: 'г',
	d: 'д',
	đ: 'ђ',
	e: 'е',
	ž: 'ж',
	z: 'з',
	i: 'и',
	j: 'ј',
	k: 'к',
	l: 'л',
	m: 'м',
	n: 'н',
	o: 'о',
	p: 'п',
	r: 'р',
	s: 'с',
	t: 'т',
	ć: 'ћ',
	u: 'у',
	f: 'ф',
	h: 'х',
	c: 'ц',
	č: 'ч',
	š: 'ш',
	W: 'В',
	w: 'в',
	X: 'Кс',
	x: 'кс',
	Y: 'И',
	y: 'и',
	Q: 'К',
	q: 'к'
};

/**
 * @internal
 * Mapping of Cyrillic characters to their Latin counterparts.
 */
const cyrillicToLatinMap: { [key: string]: string } = {
	А: 'A',
	Б: 'B',
	В: 'V',
	Г: 'G',
	Д: 'D',
	Ђ: 'Đ',
	Е: 'E',
	Ж: 'Ž',
	З: 'Z',
	И: 'I',
	Ј: 'J',
	К: 'K',
	Л: 'L',
	Љ: 'Lj',
	М: 'M',
	Н: 'N',
	Њ: 'Nj',
	О: 'O',
	П: 'P',
	Р: 'R',
	С: 'S',
	Т: 'T',
	Ћ: 'Ć',
	У: 'U',
	Ф: 'F',
	Х: 'H',
	Ц: 'C',
	Ч: 'Č',
	Џ: 'Dž',
	Ш: 'Š',
	а: 'a',
	б: 'b',
	в: 'v',
	г: 'g',
	д: 'd',
	ђ: 'đ',
	е: 'e',
	ж: 'ž',
	з: 'z',
	и: 'i',
	ј: 'j',
	к: 'k',
	л: 'l',
	љ: 'lj',
	м: 'm',
	н: 'n',
	њ: 'nj',
	о: 'o',
	п: 'p',
	р: 'r',
	с: 's',
	т: 't',
	ћ: 'ć',
	у: 'u',
	ф: 'f',
	х: 'h',
	ц: 'c',
	ч: 'č',
	џ: 'dž',
	ш: 'š'
};

/**
 * @internal
 * Builds a lookup table indexed by UTF-16 code unit from a map's single-character keys.
 */
const toTable = (map: { [key: string]: string }) => {
	const keys = Object.keys(map).filter((key) => key.length === 1);
	const size = Math.max(...keys.map((key) => key.charCodeAt(0))) + 1;
	// Pre-filled so V8 keeps a packed array instead of a sparse dictionary
	const table: (string | undefined)[] = new Array(size).fill(undefined);
	for (const key of keys) table[key.charCodeAt(0)] = map[key];
	return table;
};

const cyrillicTable = toTable(cyrillicToLatinMap);
const latinTable = toTable(latinToCyrillicMap);

/**
 * @internal
 * Two-letter Latin keys (lj, Nj, DŽ…) indexed by first, then second code unit,
 * so letters that never start a digraph skip the second lookup.
 */
const latinDigraphs: (Record<number, string> | undefined)[] = [];
for (const key of Object.keys(latinToCyrillicMap)) {
	if (key.length === 2) {
		const first = key.charCodeAt(0);
		latinDigraphs[first] = {
			...latinDigraphs[first],
			[key.charCodeAt(1)]: latinToCyrillicMap[key]
		};
	}
}

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
