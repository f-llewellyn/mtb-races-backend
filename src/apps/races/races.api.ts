import { Router } from "express";
import { getRaces, scrapeRaces } from "./races.service.js";

const racesRouter = Router();

racesRouter.get("/", getRaces);

racesRouter.get("/scrape", scrapeRaces);

export default racesRouter;
