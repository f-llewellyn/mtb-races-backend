import { MockInstance } from 'vitest';
import { initDb } from '../../src/db/index.ts';
import * as drizzlePostgres from 'drizzle-orm/node-postgres';

describe('Unit - DB Connection', () => {
	let consoleErrorSpy: MockInstance;
	let consoleLogSpy: MockInstance;
	let drizzleMock: MockInstance;

	beforeEach(() => {
		consoleErrorSpy = vi.spyOn(console, 'error');
		consoleLogSpy = vi.spyOn(console, 'log');
		vi.mock('drizzle-orm/node-postgres', { spy: true });
		drizzleMock = vi.mocked(drizzlePostgres.drizzle);
	});

	afterEach(() => {
		vi.resetAllMocks();
	});

	it('Logs error when theres an error connecting to the DB', () => {
		drizzleMock.mockImplementation(() => {
			throw new Error('Drizzle Error');
		});

		initDb();

		expect(consoleErrorSpy).toHaveBeenCalledWith(
			'Error connecting to DB',
			Error('Drizzle Error'),
		);
	});

	it('Logs success message when connection is successful', () => {
		initDb();

		expect(consoleLogSpy).toHaveBeenCalledWith(
			'Succesfully connected to the DB',
		);
	});
});
