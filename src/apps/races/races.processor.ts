import { SI_SCRAPE_QUEUE } from '../../constants/queueNames.ts';
import {
	createQueue,
	addWorker,
	scheduleJob,
	failJob,
} from '../../lib/queues/queues.ts';
import { scrapeRaces } from './races.service.ts';

export async function SiEntriesScrapeProcessor() {
	await createQueue(SI_SCRAPE_QUEUE);
	await addWorker(SI_SCRAPE_QUEUE, async ([job]) => {
		console.log(`Started job ${job.id}`);
		try {
			await scrapeRaces();
			console.log(`Finished job ${job.id}`);
		} catch (error) {
			console.error(`Job ${job.id} failed`, error);
			await failJob(SI_SCRAPE_QUEUE, job.id);
		}
	});
	// Runs every at 00:00 UTC every Monday
	await scheduleJob(SI_SCRAPE_QUEUE, '0 0 * * 1', {});
}
