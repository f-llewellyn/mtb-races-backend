export type TRace = {
	name: string;
	type: string | null;
	location: string | null;
	detailsUrl: string | null;
	date: string;
	hashedId: string;
};

export type TRaceRaw = {
	titleText: string | null;
	url: string | null;
	dateText: string | null;
	typeText: string | null;
	locationText: string | null;
};
