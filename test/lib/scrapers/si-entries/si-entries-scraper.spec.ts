import { describe, expect, it } from "vitest";
import fs from "fs";
import path from "path";
import puppeteer from "puppeteer";
import {
	sIEntriesExtractFromDOM,
	mapRawEvents,
} from "../../../../src/lib/scrapers/si-entries/si-entries-scraper.js";

describe("Unit - SI Entries Scraper", () => {
	it("Should return all races in raw format", async () => {
		const html = fs.readFileSync(
			path.join(__dirname, "si-entries.html"),
			"utf-8"
		);

		const browser = await puppeteer.launch({ headless: true });
		const page = await browser.newPage();

		await page.setContent(html);

		const text = await page.evaluate(sIEntriesExtractFromDOM);

		expect(text).toEqual([
			expect.objectContaining({
				dateText: "Sat 31 May 2025",
				locationText: "Scotland",
				titleText: "Scottish Enduro SeriesR1 - Tweed Valley",
				typeText: null,
				url: "https://www.sientries.co.uk/event.php?elid=Y&event_id=15520",
			}),
			expect.objectContaining({
				dateText: "Sun 1 Jun 2025",
				locationText: "Yorkshire & Humber",
				titleText: "Yorkshire Mountain BikeMarathon",
				typeText: null,
				url: "https://www.sientries.co.uk/event.php?elid=Y&event_id=14673",
			}),
			expect.objectContaining({
				dateText: "Sat 28 Mar 2025",
				locationText: "Scotland",
				titleText: "MacAvalanche",
				typeText: null,
				url: "https://www.sientries.co.uk/event.php?elid=Y&event_id=15402",
			}),
			expect.objectContaining({
				dateText: "Sat 9 May 2025",
				locationText: "North East",
				titleText: "Hamsterley BeastFunduro 3",
				typeText: null,
				url: "https://www.sientries.co.uk/event.php?elid=Y&event_id=15704",
			}),
			expect.objectContaining({
				dateText: "Sun 10 May 2025",
				locationText: "North East",
				titleText: "Hammers Jam",
				typeText: null,
				url: "https://www.sientries.co.uk/event.php?elid=Y&event_id=15705",
			}),
			expect.objectContaining({
				dateText: "Sat 16 May 2025",
				locationText: "Yorkshire & Humber",
				titleText: "Boltby Bash Enduro",
				typeText: null,
				url: "https://www.sientries.co.uk/event.php?elid=Y&event_id=15602",
			}),
		]);

		if (page && !page.isClosed()) {
			await page.close();
		}

		if (browser) {
			await browser.close();
		}
	});

	it("Should process raw races and return all with a title and date field in a formatted structure", async () => {
		const rawRaces = [
			{
				dateText: "Sat 31 May 2025",
				locationText: "Scotland",
				titleText: "Race 1",
				typeText: null,
				url: "https://www.sientries.co.uk/event.php?elid=Y&event_id=15520",
			},
			{
				dateText: "",
				locationText: "Scotland",
				titleText: "Race 2",
				typeText: null,
				url: "https://www.sientries.co.uk/event.php?elid=Y&event_id=15520",
			},
			{
				dateText: "Tue 2 July 2025",
				locationText: "Scotland",
				titleText: "",
				typeText: null,
				url: "https://www.sientries.co.uk/event.php?elid=Y&event_id=15520",
			},
			{
				dateText: "Thu 4 July 2025",
				locationText: null,
				titleText: "Race 4",
				typeText: null,
				url: null,
			},
		];

		const formattedResults = mapRawEvents(rawRaces);

		expect(formattedResults).toEqual([
			expect.objectContaining({
				date: "2025-05-30T23:00:00.000Z",
				detailsUrl:
					"https://www.sientries.co.uk/event.php?elid=Y&event_id=15520",
				hashedId: "39e8836d7bd1cb0c46a70f0f1f6d6016",
				location: "Scotland",
				name: "Race 1",
				type: null,
			}),
			expect.objectContaining({
				date: "2025-07-03T23:00:00.000Z",
				detailsUrl: null,
				hashedId: "cbf72fd9fcf74fe65216edfbd1f68023",
				location: null,
				name: "Race 4",
				type: null,
			}),
		]);
	});
});
