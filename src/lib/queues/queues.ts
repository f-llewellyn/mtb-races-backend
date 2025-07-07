import PgBoss, { Job } from 'pg-boss';
import { SiEntriesScrapeProcessor } from '../../apps/races/races.processor.ts';
import { TQueueInvoker } from '../../types/queue.type.ts';
import { config } from '../../config.ts';

const pgbInstance = new PgBoss(config.DATABASE_URL!);

pgbInstance.on('error', (err) => console.error(err));

const queues: TQueueInvoker[] = [SiEntriesScrapeProcessor];

export async function startPGBoss() {
	await pgbInstance.start();
	for (const invoker of queues) {
		await invoker();
	}
}

export async function createQueue(queue: string) {
	await pgbInstance.createQueue(queue);
}

export async function scheduleJob<T extends object>(
	queue: string,
	cron: string,
	data: T,
) {
	await pgbInstance.schedule(queue, cron, data);
}

export async function sendJob<T extends object>(
	queue: string,
	data: T,
): Promise<string | null> {
	return pgbInstance.send(queue, data);
}

export async function addWorker<T extends object>(
	queue: string,
	callback: (jobs: Job<T>[]) => Promise<void>,
) {
	await pgbInstance.work(queue, callback);
}
