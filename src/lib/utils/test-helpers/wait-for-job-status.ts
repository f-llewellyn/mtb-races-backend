import PgBoss, { JobWithMetadata } from 'pg-boss';

export async function waitForJobStatus(
	boss: PgBoss,
	queue: string,
	jobId: string | null,
	jobStatus: JobWithMetadata['state'],
	timeout?: number,
): Promise<boolean> {
	return vi.waitUntil(
		async () => {
			if (!jobId) return;
			const job = await boss.getJobById(queue, jobId);
			return job?.state === jobStatus;
		},
		{
			timeout: timeout ?? 10000,
		},
	);
}
