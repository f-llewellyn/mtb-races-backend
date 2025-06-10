import puppeteer from "puppeteer";
import { TRaceInsert } from "../../../db/schema.js";
import { TRaceRaw } from "../../../types/race.type.js";
import { hashRace } from "../../utils/stringToMD5.js";
import { RaceTypes } from "../../../enums/RaceTypes.enum.js";
import { SiEntriesRow } from "../../../types/siEntries.type.js";
const siEntiresMTBUrl =
	"https://www.sientries.co.uk/index.php?page=L&af=et_C_MB:Y;et_C_ED:Y;et_C_TQ:Y";

const siEntriesEventMap = {
	"MTB Enduro": RaceTypes.Enduro,
	"MTB Orienteering": RaceTypes.XC,
	"Mountain Bike": RaceTypes.XC,
};

const mapType = (type: string) => {
	return siEntriesEventMap[type as keyof typeof siEntriesEventMap] || "";
};

export const scrapeSIEntries = async (): Promise<TRaceInsert[]> => {
	let browser;
	try {
		browser = await puppeteer.launch({ headless: true });
		const page = await browser.newPage();

		await page.goto(siEntiresMTBUrl, {
			waitUntil: "networkidle2",
			timeout: 60000,
		});

		const rawEvents: TRaceRaw[] = await page.evaluate(
			sIEntriesExtractFromDOM
		);

		return mapRawEvents(rawEvents);
	} catch (error) {
		console.error("Error during scraping:", error);
		throw error;
	} finally {
		if (browser) {
			await browser.close();
		}
	}
};

export function sIEntriesExtractFromDOM() {
	const tableItems = Array.from(
		document.querySelector("#index_table")?.children || []
	);

	const reducer = (rows: SiEntriesRow[], item: Element, i: number) => {
		if (i % 2 === 0) {
			const year = item.querySelector("span")?.textContent || "";
			const monthRows = Array.from(
				tableItems[i + 1]?.querySelectorAll(".eti_wrap") || []
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
					.querySelector(".eti_title")
					?.textContent?.replace(/[\n\r\t]/gm, "") ?? null,
			url:
				element.querySelector(".eti_title a")?.getAttribute("href") ??
				null,
			dateText: `${element
				.querySelector(".eti_date")
				?.textContent?.replace(/[\t]/gm, "")
				.replace(/[\n\r]/gm, " ")
				.trim()} ${year}`,
			typeText:
				element.querySelector(".etp_cycling")?.getAttribute("title") ??
				null,
			locationText:
				element.querySelector(".eti_map img")?.getAttribute("alt") ??
				null,
		}));
}

export function mapRawEvents(rawEvents: TRaceRaw[]) {
	return rawEvents.flatMap(
		({ titleText, url, dateText, typeText, locationText }) => {
			if (!titleText || !dateText) {
				return [];
			}

			const date = new Date(dateText);

			return [
				{
					name: titleText,
					date: new Date(dateText).toISOString(),
					type: typeText ? mapType(typeText) : null,
					location: locationText,
					detailsUrl: url,
					hashedId: hashRace(titleText, date),
				},
			];
		}
	);
}
