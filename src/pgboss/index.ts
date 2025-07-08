import PgBoss, { Job } from 'pg-boss';
import { SiEntriesScrapeProcessor } from '../apps/races/races.processor.ts';
import { TQueueInvoker } from '../types/queue.type.ts';
import { config } from '../config.ts';

const queues: TQueueInvoker[] = [SiEntriesScrapeProcessor];

let boss: PgBoss | undefined;
let bossPromise: Promise<PgBoss> | undefined;

export async function getBoss() {
	if (!bossPromise) {
		bossPromise = initBoss();
		return bossPromise;
	}

	return boss!;
}

async function initBoss() {
	try {
		boss = new PgBoss(config.DATABASE_URL!);
		boss.on('error', (err) => console.error(err));

		await boss.start();

		for (const invoker of queues) {
			await invoker();
		}

		console.log('Successfully started PgBoss');

		return boss;
	} catch (error) {
		console.error('Error starting PgBoss', error);
		boss = undefined;
		bossPromise = undefined;
		throw error;
	}
}

export function resetBoss() {
	boss = undefined;
	bossPromise = undefined;
}

export async function createQueue(queue: string) {
	const bossInstance = await getBoss();
	await bossInstance.createQueue(queue);
}

export async function scheduleJob<T extends object>(
	queue: string,
	cron: string,
	data: T,
) {
	const bossInstance = await getBoss();
	await bossInstance.schedule(queue, cron, data);
}

export async function sendJob<T extends object>(
	queue: string,
	data: T,
): Promise<string | null> {
	const bossInstance = await getBoss();
	return bossInstance.send(queue, data);
}

export async function addWorker<T extends object>(
	queue: string,
	callback: (jobs: Job<T>[]) => Promise<void>,
) {
	const bossInstance = await getBoss();
	await bossInstance.work(queue, callback);
}
