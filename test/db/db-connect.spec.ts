import { MockInstance } from 'vitest';
import { getDB, resetDB } from '../../src/db/index.ts';
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
		resetDB();
	});

	it('Logs error when theres an error connecting to the DB', async () => {
		drizzleMock.mockImplementation(() => {
			throw new Error('Drizzle Error');
		});

		await expect(getDB()).rejects.toThrow('Drizzle Error');

		expect(consoleErrorSpy).toHaveBeenCalledWith(
			'Error connecting to DB',
			Error('Drizzle Error'),
		);
	});

	it('Logs success message when connection is successful', async () => {
		const db = await getDB();

		expect(db).toBeDefined();
		expect(consoleLogSpy).toHaveBeenCalledWith(
			'Successfully connected to the DB',
		);
	});

	it('Does not create multiple connection instances', async () => {
		await getDB();

		const db = await getDB();

		expect(db).toBeDefined();
		expect(drizzleMock).toHaveBeenCalledTimes(1);
	});
});
