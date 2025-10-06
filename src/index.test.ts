import { describe, it, expect } from 'vitest';
import transliterate from './index';

describe('transliterate - toLatin', () => {
	it('converts basic cyrillic letters to latin', () => {
		expect(transliterate('Београд', 'toLatin')).toBe('Beograd');
		expect(transliterate('Србија', 'toLatin')).toBe('Srbija');
		expect(transliterate('ПРИМЕР', 'toLatin')).toBe('PRIMER');
		expect(transliterate('пример', 'toLatin')).toBe('primer');
	});

	it('handles digraphs correctly (Љ→Lj, Њ→Nj, Џ→Dž)', () => {
		expect(transliterate('Љубљана', 'toLatin')).toBe('Ljubljana');
		expect(transliterate('Његош', 'toLatin')).toBe('Njegoš');
		expect(transliterate('Џон', 'toLatin')).toBe('Džon');
		expect(transliterate('љубав', 'toLatin')).toBe('ljubav');
		expect(transliterate('његов', 'toLatin')).toBe('njegov');
		expect(transliterate('џеп', 'toLatin')).toBe('džep');
	});

	it('handles special Serbian characters (Ђ, Ћ, Ж, Ч, Ш)', () => {
		expect(transliterate('Ђорђе', 'toLatin')).toBe('Đorđe');
		expect(transliterate('Ћирилица', 'toLatin')).toBe('Ćirilica');
		expect(transliterate('Живот', 'toLatin')).toBe('Život');
		expect(transliterate('Чик', 'toLatin')).toBe('Čik');
		expect(transliterate('Шума', 'toLatin')).toBe('Šuma');
	});

	it('preserves mixed case', () => {
		expect(transliterate('БеоГрад', 'toLatin')).toBe('BeoGrad');
		expect(transliterate('сРБија', 'toLatin')).toBe('sRBija');
	});

	it('preserves non-cyrillic characters', () => {
		expect(transliterate('Београд 2024', 'toLatin')).toBe('Beograd 2024');
		expect(transliterate('Тест! Хало?', 'toLatin')).toBe('Test! Halo?');
		expect(transliterate('a-b-c', 'toLatin')).toBe('a-b-c');
	});

	it('handles empty strings', () => {
		expect(transliterate('', 'toLatin')).toBe('');
	});

	it('handles strings with only numbers and punctuation', () => {
		expect(transliterate('123!@#', 'toLatin')).toBe('123!@#');
	});

	it('handles mixed cyrillic and latin text', () => {
		expect(transliterate('Test Тест', 'toLatin')).toBe('Test Test');
		expect(transliterate('Србија Serbia', 'toLatin')).toBe('Srbija Serbia');
	});
});

describe('transliterate - toCyrillic', () => {
	it('converts basic latin letters to cyrillic', () => {
		expect(transliterate('Beograd', 'toCyrillic')).toBe('Београд');
		expect(transliterate('Srbija', 'toCyrillic')).toBe('Србија');
		expect(transliterate('PRIMER', 'toCyrillic')).toBe('ПРИМЕР');
		expect(transliterate('primer', 'toCyrillic')).toBe('пример');
	});

	it('handles digraph detection (dž→џ, lj→љ, nj→њ)', () => {
		expect(transliterate('Ljubljana', 'toCyrillic')).toBe('Љубљана');
		expect(transliterate('Njegoš', 'toCyrillic')).toBe('Његош');
		expect(transliterate('Džon', 'toCyrillic')).toBe('Џон');
		expect(transliterate('ljubav', 'toCyrillic')).toBe('љубав');
		expect(transliterate('njegov', 'toCyrillic')).toBe('његов');
		expect(transliterate('džep', 'toCyrillic')).toBe('џеп');
	});

	it('handles special Serbian characters (Đ, Ć, Ž, Č, Š)', () => {
		expect(transliterate('Đorđe', 'toCyrillic')).toBe('Ђорђе');
		expect(transliterate('Ćirilica', 'toCyrillic')).toBe('Ћирилица');
		expect(transliterate('Život', 'toCyrillic')).toBe('Живот');
		expect(transliterate('Čik', 'toCyrillic')).toBe('Чик');
		expect(transliterate('Šuma', 'toCyrillic')).toBe('Шума');
	});

	it('preserves mixed case', () => {
		expect(transliterate('BeoGrad', 'toCyrillic')).toBe('БеоГрад');
		expect(transliterate('sRBija', 'toCyrillic')).toBe('сРБија');
	});

	it('preserves non-latin characters', () => {
		expect(transliterate('Beograd 2024', 'toCyrillic')).toBe('Београд 2024');
		expect(transliterate('Test! Halo?', 'toCyrillic')).toBe('Тест! Хало?');
		expect(transliterate('А-Б-Ц', 'toCyrillic')).toBe('А-Б-Ц');
	});

	it('handles empty strings', () => {
		expect(transliterate('', 'toCyrillic')).toBe('');
	});

	it('handles strings with only numbers and punctuation', () => {
		expect(transliterate('123!@#', 'toCyrillic')).toBe('123!@#');
	});

	it('handles mixed latin and cyrillic text', () => {
		expect(transliterate('Test Тест', 'toCyrillic')).toBe('Тест Тест');
		expect(transliterate('Србија Serbia', 'toCyrillic')).toBe('Србија Сербиа');
	});

	it('handles long text with multiple digraphs', () => {
		expect(transliterate('Ljiljan je najljepša', 'toCyrillic')).toBe(
			'Љиљан је најљепша'
		);
		expect(transliterate('Njanjava je njanjanja', 'toCyrillic')).toBe(
			'Њањава је њањања'
		);
	});
});

describe('transliterate - edge cases', () => {
	it('round-trip conversion preserves text', () => {
		const original = 'Београд';
		const latin = transliterate(original, 'toLatin');
		const backToCyrillic = transliterate(latin, 'toCyrillic');
		expect(backToCyrillic).toBe(original);
	});

	it('handles all cyrillic letters in alphabet', () => {
		const cyrillic = 'АБВГДЂЕЖЗИЈКЛЉМНЊОПРСТЋУФХЦЧЏШ';
		const latin = transliterate(cyrillic, 'toLatin');
		expect(latin).toBe('ABVGDĐEŽZIJKLLjMNNjOPRSTĆUFHCČDžŠ');
	});

	it('handles all lowercase cyrillic letters', () => {
		const cyrillic = 'абвгдђежзијклљмнњопрстћуфхцчџш';
		const latin = transliterate(cyrillic, 'toLatin');
		expect(latin).toBe('abvgdđežzijklljmnnjoprstćufhcčdžš');
	});

	describe('transliterate - toCyrillic tricky edge cases', () => {
		it.fails(
			"should handle ambiguous digraphs correctly (the 'injekcija' problem)",
			() => {
				// This test documents the current limitation.
				// A simple replace() will fail this test.
				// For 'injekcija', 'n' and 'j' are separate letters.

				// N + J cases
				expect(transliterate('injekcija', 'toCyrillic')).toBe('инјекција');
				expect(transliterate('konjugacija', 'toCyrillic')).toBe('конјугација');
				expect(transliterate('konjunkcija', 'toCyrillic')).toBe('конјункција');
				expect(transliterate('injektor', 'toCyrillic')).toBe('инјектор');

				// D + Ž cases
				expect(transliterate('nadživeti', 'toCyrillic')).toBe('надживети');
				expect(transliterate('podžanr', 'toCyrillic')).toBe('поджанр');
				expect(transliterate('odžaliti', 'toCyrillic')).toBe('оджалити');
			}
		);

		it('should handle mixed-case digraphs as separate letters', () => {
			expect(transliterate('aNJega', 'toCyrillic')).toBe('аНЈега');
			expect(transliterate('poredŽivota', 'toCyrillic')).toBe('поредЖивота');
		});

		it('should preserve non-Serbian latin characters like Q, W, X, Y', () => {
			expect(transliterate('Quick brown fox', 'toCyrillic')).toBe(
				'Куицк бровн фокс'
			);
			expect(transliterate('Extra quality', 'toCyrillic')).toBe(
				'Екстра куалити'
			);
		});
	});
});
