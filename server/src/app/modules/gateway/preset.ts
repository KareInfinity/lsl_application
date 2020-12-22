import { logger } from "./utils";
import { PresetService } from "./service/preset.service";
import { adt_inbound_queue } from "./queue/adt_inbound_queue";
import NotificationService from "./service/notification.service";

class Preset {
	constructor() {}
	public async asynchronous() {
		try {
			var TAG = "[PRESET ASYNCHRONOUS]\t";
			logger.info(TAG + "STARTED");
			// await adt_inbound_queue.init();
			var notification_service = new NotificationService();
			// await notification_service.getNotificationManagerUrlFromEC();
			await notification_service.registerMessageProfiles();
			logger.info(TAG + "DONE");
		} catch (e) {
			var error = e;
			throw error;
		}
	}
	synchronous() {
		try {
			var TAG = "[PRESET SYNCHRONOUS]\t";
			logger.info(TAG + "STARTED");

			logger.info(TAG + "DONE");
		} catch (error) {
			throw error;
		}
	}
}
export { Preset as GatewayPreset };
