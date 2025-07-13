import { SI_SCRAPE_QUEUE } from '../../constants/queueNames.js';
import { createQueue, addWorker, scheduleJob } from '../../pgboss/index.js';
import { revalidateFrontendTag } from '../revalidate/revalidate.service.js';
import { scrapeRaces } from './races.service.js';

export async function scrapeSiEntriesProcess(id: string) {
	console.log(`Started job ${id}`);
	try {
		await scrapeRaces();
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
		async ([job]) => await scrapeSiEntriesProcess(job.id),
	);
	// Runs every at 00:00 UTC every Monday
	await scheduleJob(SI_SCRAPE_QUEUE, '0 0 * * 1', {});
}
