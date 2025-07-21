import { TRaceRaw } from '../../../types/race.type.js';

export function britishCyclingExtractFromDOM(): TRaceRaw[] {
	const dateParser = (date?: string) => {
		if (!date) return;
		const dateSection = date.split(' ')[1];
		const [day, month, year] = dateSection.split('/');

		return `${month}/${day}/${year}`;
	};

	const tableItems = Array.from(
		document.querySelectorAll(
			'#events_list div table tbody .events--desktop__row:not(:has(th))',
		),
	);

	return tableItems.map((element) => {
		const urlPath = element
			.querySelector(
				'.table__more-cell .table__more-label .event--race__title',
			)
			?.getAttribute('href');

		return {
			titleText:
				element
					.querySelector(
						'.table__more-cell .table__more-label .event--race__title',
					)
					?.textContent?.trim() ?? null,
			url: urlPath ? `https://www.britishcycling.org.uk${urlPath}` : null,
			dateText:
				dateParser(
					element
						.querySelector('.event--date__column')
						?.textContent?.split('-')[0]
						.trim(),
				) ?? null,
			typeText:
				element
					.querySelector('.event--type__row')
					?.textContent?.trim() ?? null,
			locationText:
				element.querySelector('td:not([class])')?.textContent?.trim() ??
				null,
		};
	});
}
