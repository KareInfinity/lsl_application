import Bull, { Job } from "bull";
import { setQueues } from "bull-board";
import { Hl7Persister } from "../../global/utils/hl7persister";

class TestQueue {
	queue?: Bull.Queue<{ value: string }>;
	constructor() { }
	async init() {
		try {
			this.queue = new Bull<{ value: string }>(
				"test_queue",
				"redis://127.0.0.1:7001"
			);
			this.queue.process(async (job: Job<{ value: string }>) => {
				try {
					var service: Hl7Persister = new Hl7Persister();
					// await service.Persist(job.data.value)
				} catch (error) {
					throw error
				}
			});
			setQueues(this.queue);
		} catch (error) {
			throw error;
		}
	}
	async add(data: { value: string }) {
		var result: Job<{ value: string }>;
		try {
			result = await (this.queue as Bull.Queue<{ value: string }>).add(
				data
			);
		} catch (error) {
			throw error;
		}
		return result;
	}
}
export const test_queue = new TestQueue();
