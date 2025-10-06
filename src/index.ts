/**
 * The direction of the transliteration. Can be 'toLatin' or 'toCyrillic'.
 */
type Direction = 'toLatin' | 'toCyrillic';

/**
 * @internal
 * Mapping of Latin characters and digraphs to their Cyrillic counterparts.
 */
const latinToCyrillicMap: { [key: string]: string } = {
	Dž: 'Џ',
	dž: 'џ',
	Lj: 'Љ',
	lj: 'љ',
	Nj: 'Њ',
	nj: 'њ',
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
 * Regex for matching all Latin characters and digraphs that can be transliterated.
 */
const latinRegex = new RegExp(
	Object.keys(latinToCyrillicMap)
		.sort((a, b) => b.length - a.length)
		.join('|'),
	'g'
);

/**
 * @internal
 * Regex for matching all Cyrillic characters that can be transliterated.
 */
const cyrillicRegex = new RegExp(
	Object.keys(cyrillicToLatinMap).join('|'),
	'g'
);

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
		return text.replace(
			cyrillicRegex,
			(char) => cyrillicToLatinMap[char] || char
		);
	} else {
		return text.replace(
			latinRegex,
			(match) => latinToCyrillicMap[match] || match
		);
	}
};
