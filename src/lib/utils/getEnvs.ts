import { config } from "dotenv";

export function getEnvs() {
	const envFile = process.env.NODE_ENV === "test" ? ".env.test" : ".env";
	config({ path: envFile });
}
