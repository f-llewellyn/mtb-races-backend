import express from "express";
import apiRouter from "./router.js";
import { getEnvs } from "./lib/utils/getEnvs.js";

getEnvs();
export const app = express();
const port = process.env.PORT || 3000;

app.get("/", (_, res) => {
	res.send("Hello World");
});

app.get("/health", (_, res) => {
	res.send();
});

app.use("/api", apiRouter);

app.listen(port, () => {
	console.log(`Server is running on port ${port}`);
});
