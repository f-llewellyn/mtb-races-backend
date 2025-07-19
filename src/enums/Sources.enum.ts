import { getEnumValues } from '../lib/utils/getEnumValues.js';

export enum Sources {
	SI_ENTRIES = 'Si Entries',
	BRITICH_CYCLING = 'British Cycling',
}

export const sourcesEnumValues = getEnumValues(Sources);
