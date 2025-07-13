import { getEnumValues } from '../lib/utils/getEnumValues.js';

export enum RaceTypes {
	XC = 'XC',
	Enduro = 'Enduro',
	Downhill = 'Downhill',
}

export const raceTypesValues = getEnumValues(RaceTypes);
