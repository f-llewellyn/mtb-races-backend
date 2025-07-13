import { MockInstance } from 'vitest';
import PgBoss from 'pg-boss';
import { getBoss, resetBoss } from '../../src/pgboss/index.js';

describe('Unit - DB Connection', () => {
	let consoleErrorSpy: MockInstance;
	let consoleLogSpy: MockInstance;
	let pgBossStartMock: MockInstance;

	beforeEach(() => {
		consoleErrorSpy = vi.spyOn(console, 'error');
		consoleLogSpy = vi.spyOn(console, 'log');
		pgBossStartMock = vi.spyOn(PgBoss.prototype, 'start');
	});

	afterEach(() => {
		vi.resetAllMocks();
		resetBoss();
	});

	it('Logs error when theres an error connecting to the DB', async () => {
		pgBossStartMock.mockImplementation(() => {
			throw new Error('PgBoss Error');
		});

		await expect(getBoss()).rejects.toThrow('PgBoss Error');

		expect(consoleErrorSpy).toHaveBeenCalledWith(
			'Error starting PgBoss',
			Error('PgBoss Error'),
		);
	});

	it('Logs success message when connection is successful', async () => {
		const boss = await getBoss();

		expect(boss).toBeDefined();
		expect(consoleLogSpy).toHaveBeenCalledWith(
			'Successfully started PgBoss',
		);
	});

	it('Does not create multiple connection instances', async () => {
		await getBoss();

		const boss = await getBoss();

		expect(boss).toBeDefined();
		expect(pgBossStartMock).toHaveBeenCalledTimes(1);
	});
});
