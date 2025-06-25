import { getEnumValues } from '../lib/utils/getEnumValues.ts';

export enum Sources {
	SI_ENTRIES = 'Si Entries',
}

export const sourcesEnumValues = getEnumValues(Sources);
