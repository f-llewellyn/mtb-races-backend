import {
	BC_SCRAPE_QUEUE,
	SI_SCRAPE_QUEUE,
} from '../../constants/queueNames.js';
import { Sources } from '../../enums/Sources.enum.js';
import { createQueue, addWorker, scheduleJob } from '../../pgboss/index.js';
import { revalidateFrontendTag } from '../revalidate/revalidate.service.js';
import { scrapeRaces } from './races.service.js';

export async function scrapeProcess(id: string, source: Sources) {
	console.log(`Started job ${id}`);
	try {
		await scrapeRaces(source);
		await revalidateFrontendTag('races');
		console.log(`Finished job ${id}`);
	} catch (error) {
		console.error(`Job ${id} failed`, error);
	}
}

export async function SiEntriesScrapeProcessor() {
	await createQueue(SI_SCRAPE_QUEUE);
	await addWorker(
		SI_SCRAPE_QUEUE,
		async ([job]) => await scrapeProcess(job.id, Sources.SI_ENTRIES),
	);
	// Runs  at 00:00 UTC every Monday
	await scheduleJob(SI_SCRAPE_QUEUE, '0 0 * * 1', {});
}

export async function BCScrapeProcessor() {
	await createQueue(BC_SCRAPE_QUEUE);
	await addWorker(
		BC_SCRAPE_QUEUE,
		async ([job]) => await scrapeProcess(job.id, Sources.BRITICH_CYCLING),
	);
	// Runs every at 00:00 UTC every Tuesday
	await scheduleJob(SI_SCRAPE_QUEUE, '0 0 * * 2', {});
}
