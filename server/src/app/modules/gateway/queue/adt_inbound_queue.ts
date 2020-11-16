import Bull, { Job } from "bull";
import { setQueues } from "bull-board";
import { Hl7Persister } from "../../global/utils/hl7persister";

class ADTInboundQueue {
	queue?: Bull.Queue<{ value: string }>;
	constructor() { }
	async init() {
		try {
			this.queue = new Bull<{ value: string }>(
				"adt_inbound_queue",
				"redis://127.0.0.1:7001"
			);
			this.queue.process(async (job: Job<{ value: string }>) => {
				try {
					var hl7_persister_service: Hl7Persister = new Hl7Persister();
					await hl7_persister_service.PersistPeople(job.data.value);
				} catch (error) {
					console.log("error from queue", error);
					throw error;
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
export const adt_inbound_queue = new ADTInboundQueue();
