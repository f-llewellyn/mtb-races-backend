import { getEnumValues } from '../lib/utils/getEnumValues.js';

export enum RaceTypes {
	XC = 'XC',
	Enduro = 'Enduro',
	Downhill = 'Downhill',
	FourTrack = '4X',
}

export const raceTypesValues = getEnumValues(RaceTypes);
