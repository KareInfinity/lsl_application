import * as _ from "lodash";
import axios from "axios";
import { Environment } from "../../global/utils";
import { BaseService } from "./base.service";
import { NotificationMessage } from "../../global/models/notificationmessage.model";
import { GlobalBaseService } from "../../global/service/globalbase.service";
import PluginParameter from "../../global/models/pluginparameter.model";
import { AuthService } from "../../auth/service/auth.service";
import AppMsgProfile, {
	AppMsgProfileCriteria,
} from "../models/appmsgprofile.model";
import { ActionReq } from "../../global/models/actionreq.model";
import { ErrorResponse } from "../../global/models/errorres.model";
class NotificationService extends BaseService {
	constructor() {
		super();
		this.environment = new Environment();
	}
	environment: Environment;

	async getNotificationManagerUrlFromEC() {
		var result = this.environment.NM_URL;
		try {
			if (result == "") {
				var auth_service = new AuthService();
				var notification_manager_info = await auth_service.getPluginInfoViaEC(
					this.environment.NM_UNIQUE_NAME
				);
				this.environment._NM_URL =
					notification_manager_info.data?.baseUrl +
					":" +
					notification_manager_info.data?.serverPort;
				result = this.environment.NM_URL;
			}
		} catch (error) {
			throw error;
		}
		return result;
	}

	async sendNotification(
		notification: NotificationMessage
	): Promise<boolean> {
		var result: boolean = false;
		try {
			var auth_service = new AuthService();
			var headers: any = {
				"Content-Type": "application/json",
				Accept: "application/json",
				accesstoken: auth_service.generateHMAC(),
			};
			var nm_url = await this.getNotificationManagerUrlFromEC();
			var url = nm_url + this.environment.NM_API_ENDPOINTS.inbound;
			var config = { headers };
			var request: PluginParameter<
				Array<NotificationMessage>
			> = new PluginParameter<Array<NotificationMessage>>({
				method: "notify",
				mode: "post",
				source_application: "Lifeshield",
				to_application: "Notification Manager",
				value: [notification],
			});
			this.log(GlobalBaseService.LogLevels.info, {
				request,
				config,
				url,
			});

			var resp = await axios.post(url, request, config);
			result = true;
		} catch (error) {
			this.log(GlobalBaseService.LogLevels.error, error);
		}
		return result;
	}
	async registerMessageProfiles() {
		try {
			var message_profile_list: Array<AppMsgProfileCriteria> = this
				.environment.NM_MESSAGE_PROFILE_LIST;
			var auth_service = new AuthService();
			var headers: any = {
				"Content-Type": "application/json",
				Accept: "application/json",
				accesstoken: auth_service.generateHMAC(),
			};
			var nm_url = await this.getNotificationManagerUrlFromEC();
			var url =
				nm_url +
				this.environment.NM_API_ENDPOINTS.register_message_profile;
			var config = { headers };
			var promise_list: Array<Promise<any>> = [];
			_.forEach(message_profile_list, (v) => {
				var request = new ActionReq<AppMsgProfile>({
					item: v,
				});
				promise_list.push(
					new Promise(async (resolve, reject) => {
						var result = new AppMsgProfileCriteria();
						try {
							var resp = await axios.post(url, request, config);
							result = resp.data;
						} catch (e) {
							var error = e;
							result = new AppMsgProfileCriteria(v);
							result.error = new ErrorResponse({
								source: error,
								item: _.get(error, "response.data", null),
							});
							resolve(result);
						}
						resolve(result);
					})
				);
			});
			var resp = await Promise.all(promise_list);
			this.log(GlobalBaseService.LogLevels.info, resp);
		} catch (e) {
			var error = e;
			this.log(GlobalBaseService.LogLevels.error, error);
			throw error;
		}
	}
}

export default NotificationService;
