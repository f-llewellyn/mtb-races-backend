import { afterEach, describe, expect, it } from "vitest";
import request from "supertest";
import { app } from "../../../src/index";
import { db } from "../../../src/db";
import { racesTable } from "../../../src/db/schema";

describe("E2E - Get Races", () => {
	afterEach(async () => {
		await db.delete(racesTable);
	});

	it("Returns 200 and an empty array when no races are stored", async () => {
		const { body } = await request(app).get("/api/races").expect(200);

		expect(body).toEqual([]);
	});

	it("Returns 200 and an array of saved events", async () => {
		await db.insert(racesTable).values([
			{
				name: "Race 1",
				date: "2004-01-30",
				hashedId: "hashedid1",
				location: "Chesterfield",
				detailsUrl: "https://races.com/race1",
			},
			{
				name: "Race 2",
				date: "2002-02-02",
				hashedId: "hashedid2",
				location: "Chesterfield",
				detailsUrl: "https://races.com/race2",
			},
		]);

		const { body } = await request(app).get("/api/races").expect(200);

		expect(body).toEqual([
			expect.objectContaining({
				name: "Race 1",
				date: "2004-01-30",
				hashedId: "hashedid1",
				location: "Chesterfield",
				detailsUrl: "https://races.com/race1",
			}),
			expect.objectContaining({
				name: "Race 2",
				date: "2002-02-02",
				hashedId: "hashedid2",
				location: "Chesterfield",
				detailsUrl: "https://races.com/race2",
			}),
		]);
	});
});
