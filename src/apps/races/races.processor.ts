import { SI_SCRAPE_QUEUE } from '../../constants/queueNames.ts';
import { createQueue, addWorker, scheduleJob } from '../../pgboss/index.ts';
import { revalidateFrontendTag } from '../revalidate/revalidate.service.ts';
import { scrapeRaces } from './races.service.ts';

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
