import express from "express";
import apiRouter from "./router.js";
import { startPGBoss } from "./lib/queues/queues.js";

await startPGBoss();
export const app = express();

app.get("/", (_, res) => {
	res.send("Hello World");
});

app.get("/health", (_, res) => {
	res.send();
});

app.use("/api", apiRouter);

const port = 3000;

app.listen(port, () => {
	console.log(`Server is running on port ${port}`);
});
