import { createHash } from 'crypto';

export function hashString(string: string) {
	return createHash('md5').update(string).digest('hex');
}

export function hashRace(titleText: string, date: Date) {
	return hashString(
		`${titleText}-${date.getUTCFullYear}-${date.getUTCMonth}`
			.replaceAll(' ', '')
			.toLowerCase(),
	);
}
