import { global_logger } from "./utils";
class Preset {
	constructor() {}
	public async asynchronous() {
		try {
			var TAG = "[PRESET ASYNCHRONOUS]\t";
			global_logger.info(TAG + "STARTED");

			global_logger.info(TAG + "DONE");
		} catch (error) {
			throw error;
		}
	}
	synchronous() {
		try {
			var TAG = "[PRESET SYNCHRONOUS]\t";
			global_logger.info(TAG + "STARTED");

			global_logger.info(TAG + "DONE");
		} catch (error) {
			throw error;
		}
	}
}
export { Preset as GlobalPreset };
