import { Router } from "express";
import racesRouter from "./apps/races/races.api.js";

const router = Router();

router.use("/races", racesRouter);

export default router;
