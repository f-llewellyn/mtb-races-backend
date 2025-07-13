import { config } from '../../config.js';

export async function revalidateFrontendTag(tag: string): Promise<void> {
	try {
		await fetch(`${config.FRONTEND_BASE_URL}/api/revalidate`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				tag,
			}),
		});
	} catch (error) {
		console.error(`Error while revalidating tag: ${tag}`, error);
	}
}
