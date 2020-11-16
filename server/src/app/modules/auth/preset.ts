import { logger } from "./utils";
import { PresetService } from "./service/preset.service";
import { AuthService } from "./service/auth.service";
class Preset {
	constructor() {}
	public async asynchronous() {
		try {
			var TAG = "[PRESET ASYNCHRONOUS]\t";
			logger.info(TAG + "STARTED");

			var preset_service = new PresetService();
			await preset_service.registerApplication();
			var auth_service = new AuthService();
			await auth_service.getISASSecurityModel();
			
			logger.info(TAG + "DONE");
		} catch (error) {
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
export { Preset as AuthPreset };
