import { Request, Response } from "express";
import { scrapeSIEntries } from "../../lib/scrapers/si-entries/si-entries.scraper.js";

export const getRaces = async (req: Request, res: Response) => {
	res.json([
		{
			title: "Welsh Dragon MTB Challenge",
			date: "2024-06-15",
			location: "Snowdonia, Wales",
		},
		{
			title: "Scottish Highlands Enduro",
			date: "2024-07-22",
			location: "Fort William, Scotland",
		},
		{
			title: "Peak District XC Classic",
			date: "2024-08-10",
			location: "Edale, Peak District",
		},
		{
			title: "Lake District Technical Trail",
			date: "2024-09-03",
			location: "Keswick, Lake District",
		},
		{
			title: "South Downs Marathon",
			date: "2024-09-24",
			location: "Brighton, East Sussex",
		},
	]);
};

export const scrapeRaces = async (req: Request, res: Response) => {
	const races = await scrapeSIEntries();
	res.json(races);
};
