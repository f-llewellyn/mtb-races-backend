import { createHash } from "crypto";

export const hashString = (string: string) => {
	return createHash("md5").update(string).digest("hex");
};
