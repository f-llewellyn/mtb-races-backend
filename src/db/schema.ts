import {
	date,
	integer,
	pgTable,
	timestamp,
	varchar,
} from 'drizzle-orm/pg-core';

export const racesTable = pgTable('races', {
	id: integer().primaryKey().generatedByDefaultAsIdentity(),
	name: varchar({ length: 255 }).notNull(),
	type: varchar({ length: 255 }),
	location: varchar({ length: 255 }),
	detailsUrl: varchar({ length: 255 }),
	date: date().notNull(),
	hashedId: varchar({ length: 255 }).unique().notNull(),
	createdAt: timestamp().defaultNow().notNull(),
	updatedAt: timestamp()
		.defaultNow()
		.$onUpdate(() => new Date())
		.notNull(),
});

export type TRace = typeof racesTable.$inferSelect;
export type TRaceInsert = typeof racesTable.$inferInsert;
