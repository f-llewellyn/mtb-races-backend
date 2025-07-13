import { SiEntriesRow } from '../../../types/siEntries.type.js';

export function sIEntriesExtractFromDOM() {
	const tableItems = Array.from(
		document.querySelector('#index_table')?.children || [],
	);

	const reducer = (rows: SiEntriesRow[], item: Element, i: number) => {
		if (i % 2 === 0) {
			const year = item.querySelector('span')?.textContent || '';
			const monthRows = Array.from(
				tableItems[i + 1]?.querySelectorAll('.eti_wrap') || [],
			);
			rows.push(...monthRows.map((element) => ({ year, element })));
		}
		return rows;
	};

	return tableItems
		.reduce(reducer, [] as SiEntriesRow[])
		.map(({ year, element }) => ({
			titleText:
				element
					.querySelector('.eti_title')
					?.textContent?.replace(/[\n\r\t]/gm, '') ?? null,
			url:
				element.querySelector('.eti_title a')?.getAttribute('href') ??
				null,
			dateText: `${element
				.querySelector('.eti_date')
				?.textContent?.replace(/[\t]/gm, '')
				.replace(/[\n\r]/gm, ' ')
				.trim()} ${year}`,
			typeText:
				element
					.querySelector('.etp_cycling img')
					?.getAttribute('title') ?? null,
			locationText:
				element.querySelector('.eti_map img')?.getAttribute('alt') ??
				null,
		}));
}
