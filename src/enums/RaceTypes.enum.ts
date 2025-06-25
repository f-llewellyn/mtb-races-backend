import { getEnumValues } from '../lib/utils/getEnumValues.ts';

export enum RaceTypes {
	XC = 'XC',
	Enduro = 'Enduro',
	Downhill = 'Downhill',
}

export const raceTypesValues = getEnumValues(RaceTypes);
