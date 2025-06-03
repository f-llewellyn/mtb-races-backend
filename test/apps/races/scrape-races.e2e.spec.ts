import request from "supertest";
import { MockInstance } from "vitest";
import { app } from "../../../src/index.js";
import { db } from "../../../src/db/index.js";
import { racesTable } from "../../../src/db/schema.js";
import * as siEntriesScraperModule from "../../../src/lib/scrapers/si-entries/si-entries-scraper.js";

describe("E2E - Scrape Races", () => {
	let scrapeSIEntriesMock: MockInstance;

	beforeEach(() => {
		scrapeSIEntriesMock = vi.spyOn(
			siEntriesScraperModule,
			"scrapeSIEntries"
		);
	});

	afterEach(async () => {
		await db.delete(racesTable);
		scrapeSIEntriesMock.mockReset();
	});

	it("Returns 200, inserts records in database", async () => {
		scrapeSIEntriesMock.mockImplementation(async () => {
			return Promise.resolve([
				{
					name: "Race 1",
					date: "2004-01-30",
					hashedId: "39e8836d7bd1cb0c46a70f0f1f6d6016",
					location: "Chesterfield",
					detailsUrl: "https://races.com/race1",
				},
				{
					name: "Race 2",
					date: "2002-02-02",
					hashedId: "516d5f5393ffb53c12f058b9cdca7dd0",
					location: "Chesterfield",
					detailsUrl: "https://races.com/race2",
				},
			]);
		});

		await request(app).get("/api/races/scrape").expect(201);

		const { body } = await request(app).get("/api/races").expect(200);

		expect(body).toEqual([
			expect.objectContaining({
				name: "Race 1",
				date: "2004-01-30",
				hashedId: "39e8836d7bd1cb0c46a70f0f1f6d6016",
				location: "Chesterfield",
				detailsUrl: "https://races.com/race1",
			}),
			expect.objectContaining({
				name: "Race 2",
				date: "2002-02-02",
				hashedId: "516d5f5393ffb53c12f058b9cdca7dd0",
				location: "Chesterfield",
				detailsUrl: "https://races.com/race2",
			}),
		]);
	});

	it("Returns 200 and an array of saved events", async () => {
		await db.insert(racesTable).values([
			{
				name: "Race 1",
				date: "2004-01-30",
				hashedId: "39e8836d7bd1cb0c46a70f0f1f6d6016",
				location: "Chesterfield",
				detailsUrl: "https://races.com/race1",
			},
		]);

		scrapeSIEntriesMock.mockImplementation(async () => {
			return Promise.resolve([
				{
					name: "Race 1",
					date: "2026-01-30",
					hashedId: "39e8836d7bd1cb0c46a70f0f1f6d6016",
					location: "High Wycombe",
					detailsUrl: "https://races.com/race1#new",
				},
			]);
		});

		await request(app).get("/api/races/scrape").expect(201);

		const { body } = await request(app).get("/api/races").expect(200);

		expect(body).toEqual([
			expect.objectContaining({
				name: "Race 1",
				date: "2026-01-30",
				hashedId: "39e8836d7bd1cb0c46a70f0f1f6d6016",
				location: "High Wycombe",
				detailsUrl: "https://races.com/race1#new",
			}),
		]);
	});
});
