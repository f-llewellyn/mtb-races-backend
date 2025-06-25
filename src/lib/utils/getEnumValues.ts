export function getEnumValues(enumVal: object): string[] {
	return Object.values(enumVal).filter(
		(value) => typeof value === 'string',
	) as string[];
}
