import * as _ from "lodash";
import axios from "axios";
import { BaseService } from "./base.service";
import { Environment } from "../../global/utils";
import { ECResponse, GetPluginInfoViaEC, ISASRegistrationViaEC } from "../models/misc.model";
import { ErrorResponse } from "../../global/models/errorres.model";

class PresetService extends BaseService {
	registerWithISASViaEC = async (): Promise<
		ECResponse<ISASRegistrationViaEC>
	> => {
		let result: ECResponse<ISASRegistrationViaEC> = new ECResponse<
			ISASRegistrationViaEC
		>();
		try {
			var config = {
				headers: {
					"Content-Type": "application/json",
				},
			};
			var post_data = {
				appName: this.environment.ISAS_APPLICATION_NAME,
				appVersion: this.environment.ISAS_APPLICATION_VERSION,
				privileges: this.environment.ISAS_APPLLICATION_PRIVILEGE_LIST,
			};
			var ec_response = await axios.post(
				`${this.environment.EC_URL}${this.environment.EC_API_ENDPOINTS.register_application}`,
				post_data,
				config
			);
			result = ec_response.data;
			if (!(result["responseCode"] == 0)) {
				throw new ErrorResponse({
					item: result,
				});
			}
		} catch (error) {
			if (_.get(error, "isAxiosError", false))
				throw new ErrorResponse({
					item: _.get(error, "response.data", null),
				});
			else {
				throw error;
			}
		}
		return result;
	};
	async registerApplication() {
		try {
			/* register with ISAS with EC */
			var registeration_resp = await this.registerWithISASViaEC();
			/* store App ID and App Secret in environment */
			this.environment._ISAS_APPLICATION_ID = registeration_resp.data
				?.Application_Id as string;
			this.environment._ISAS_APPLICATION_SECRET = registeration_resp.data
				?.Application_Secret as string;
		} catch (error) {
			throw error;
		}
	}
	
}

export { PresetService };
