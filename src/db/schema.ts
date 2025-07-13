import {
	date,
	integer,
	pgEnum,
	pgTable,
	timestamp,
	varchar,
} from 'drizzle-orm/pg-core';
import { RaceTypes } from '../enums/RaceTypes.enum.js';
import { Sources } from '../enums/Sources.enum.js';

export const raceTypesEnum = pgEnum('race_types', RaceTypes);
export const sourcesEnum = pgEnum('sources', Sources);

export const racesTable = pgTable('races', {
	id: integer().primaryKey().generatedByDefaultAsIdentity(),
	name: varchar({ length: 255 }).notNull(),
	type: raceTypesEnum(),
	location: varchar({ length: 255 }),
	detailsUrl: varchar({ length: 255 }),
	date: date().notNull(),
	hashedId: varchar({ length: 255 }).unique().notNull(),
	source: sourcesEnum(),
	createdAt: timestamp().defaultNow().notNull(),
	updatedAt: timestamp()
		.defaultNow()
		.$onUpdate(() => new Date())
		.notNull(),
});

export type TRace = typeof racesTable.$inferSelect;
export type TRaceInsert = typeof racesTable.$inferInsert;
