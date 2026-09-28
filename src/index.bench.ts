import { test } from 'vitest';
import peer from 'serbian-transliteration';
import transliterate from './index';

// ~1 KB of ordinary prose covering every letter, digraphs, digits and punctuation
const cyrillic = `Љубав према књизи почиње у детињству. Његош је писао „Горски вијенац“ 1847. године, а Џон је прочитао сва 2.819 стихова у једном даху. Ђорђе и Ћирило су шетали кроз Чачак, Шабац и Жабаљ, тражећи стару књижару пуну прашњавих џепних издања. Продавачица, љубазна жена од 63 године, понудила им је чај, кафу и свеже пециво. „Овде се чита полако“, рекла је, „јер реч која се пожури – заборави се.“ Њих двојица су купили седам књига, једну мапу Шумадије и џак пун разгледница из Херцеговине, Врања и Љубовије. Увече су у хотелу „Фењер“ бројали динаре: 4.350 за књиге, 780 за мапу и 1.200 за вечеру од пасуља, чорбе и ћевапа. Сутрадан су наставили пут ка Златибору, где је ваздух чист, а шуме густе и мирне. Тамо су срели фотографа Жељка, који већ двадесет година снима изласке сунца изнад Увца. Показао им је хиљаде слика, свака са датумом, сатом и кратком белешком о облацима. „Сваки дан је другачији“, објаснио је, „али светлост увек дође на исто место.“`;
const latin = transliterate(cyrillic, 'toLatin');

// Only compare libraries that agree on the output
if (peer.toLatin(cyrillic) !== latin) throw new Error('toLatin outputs differ');
if (peer.toCyrillic(latin) !== transliterate(latin, 'toCyrillic'))
	throw new Error('toCyrillic outputs differ');

test(`toLatin (${cyrillic.length} chars)`, async ({ bench }) => {
	await bench.compare(
		bench('serbian-transliterate', () => {
			transliterate(cyrillic, 'toLatin');
		}),
		bench('serbian-transliteration', () => {
			peer.toLatin(cyrillic);
		})
	);
});

test(`toCyrillic (${latin.length} chars)`, async ({ bench }) => {
	await bench.compare(
		bench('serbian-transliterate', () => {
			transliterate(latin, 'toCyrillic');
		}),
		bench('serbian-transliteration', () => {
			peer.toCyrillic(latin);
		})
	);
});
