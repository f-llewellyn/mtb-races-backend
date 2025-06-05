import { SI_SCRAPE_QUEUE } from "../../constants/queueNames.js";
import { createQueue, sendJob, addWorker } from "../../lib/queues/queues.js";

interface SIEntriesScrapeData {
	text: string;
}

export async function SiEntriesScrapeProcessor() {
	try {
		await createQueue(SI_SCRAPE_QUEUE);
		await addWorker<SIEntriesScrapeData>(SI_SCRAPE_QUEUE, async ([job]) => {
			console.log(
				`received job ${job.id} with message: ${job.data.text}`
			);
		});
		await sendJob<SIEntriesScrapeData>(SI_SCRAPE_QUEUE, {
			text: "Hello World!",
		});
	} catch (error) {
		console.error(error);
	}
}
