import { getEnumValues } from '../lib/utils/getEnumValues.js';

export enum Sources {
	SI_ENTRIES = 'Si Entries',
}

export const sourcesEnumValues = getEnumValues(Sources);
