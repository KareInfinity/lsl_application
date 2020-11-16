import { using, Environment } from "../../global/utils";
import { BaseService } from "./base.service";
import * as _ from "lodash";
import { ErrorResponse } from "../../global/models/errorres.model";
import moment from "moment";
import { AuthService } from "../../auth/service/auth.service";
import { UserSessionService } from "../../auth/service/usersession.service";
import { UserSession } from "../../auth/models/usersession.model";
import axios, { AxiosResponse } from "axios";
import { FeatureMiscModel, PluginInfoMiscModel } from "../models/misc.model";
export class MiscService extends BaseService {
	constructor() {
		super();
		this.environment = new Environment();
	}
	environment: Environment;
	async getISASSitePermission(user_id: string) {
		var result: Array<any> = [];
		try {
			var usersession_service = new UserSessionService();
			var usersession_list = await usersession_service.getUserSessionOrderByModifiedOn(
				new UserSession({
					user_id,
				})
			);
			if (usersession_list.length == 0) {
				throw new ErrorResponse({
					message: "User session not found",
				});
			}
			var usersession = usersession_list[0];

			var auth_service = new AuthService();

			var config = {
				headers: {
					"Content-Type": "application/json",
					Accept: "application/json",
					Authorization: auth_service.generateAuthorizationHeader(),
				},
			};
			var post_data = {
				sitepermissionrequest: {
					accesstoken: usersession.isas_access_token,
				},
			};
			var isas_url = await auth_service.getISASURL();
			var url = `${isas_url}${this.environment.ISAS_API_ENDPOINTS.site_permission}`;
			var resp = await axios.post(url, post_data, config);
			if (_.has(resp.data, "SitePermissionResponse.Sites")) {
				result = _.get(resp.data, "SitePermissionResponse.Sites");
			}
		} catch (e) {
			var error = e;
			throw error;
		}
		return result;
	}
	async getLicenseManagerInfoFromEC() {
		var result: PluginInfoMiscModel = new PluginInfoMiscModel();
		try {
			var auth_service = new AuthService();
			var headers: any = {
				"Content-Type": "application/json",
				Accept: "application/json",
				uniqueName: this.environment.LM_UNIQUE_NAME,
				accesstoken: auth_service.generateHMAC(),
			};
			var url =
				this.environment.EC_URL +
				this.environment.EC_API_ENDPOINTS.plugins;
			var config = { headers };
			var resp = await axios.get(url, config);
			if (_.has(resp, "data.data")) {
				var lm_info = resp.data.data;
				result.base_url = lm_info.baseUrl;
				result.name = lm_info.name;
				result.server_port = lm_info.serverPort;
				result.ui_port = lm_info.uiport;
				result.api_endpoints = this.environment.LM_API_ENDPOINTS;
			}
		} catch (error) {
			throw error;
		}
		return result;
	}
	async getLicenseManagerURL() {
		var result = this.environment.LM_URL;
		try {
			if (result == "") {
				var auth_service = new AuthService();
				var lm_info = await auth_service.getPluginInfoViaEC(
					this.environment.LM_UNIQUE_NAME
				);
				result = lm_info.data?.baseUrl + ":" + lm_info.data?.serverPort;
				this.environment._LM_URL = result;
			}
		} catch (error) {
			throw error;
		}
		return result;
	}
	async getConfigurationDeviceList() {
		var result: Array<FeatureMiscModel> = new Array<FeatureMiscModel>();
		try {
			var auth_service = new AuthService();
			var auth_service = new AuthService();
			var headers: any = {
				"Content-Type": "application/json",
				Accept: "application/json",
				accesstoken: auth_service.generateHMAC(),
			};
			var lm_url = await this.getLicenseManagerURL();
			var url = `${lm_url}${this.environment.LM_API_ENDPOINTS.get_entapp_features}?ent_key=${this.environment.LM_ENT_KEY}&app_key=${this.environment.LM_APP_KEY}&app_from_ver=${this.environment.LM_FROM_VER}`;
			var config = { headers };
			var resp = await axios.get(url, config);
			if (_.has(resp, "data.item.features")) {
				_.forEach(resp.data.item.features, (v) => {
					result.push(new FeatureMiscModel(v));
				});
			}
		} catch (error) {
			throw error;
		}
		return result;
	}
	async getNotificationManagerViewerUrl() {
		var result: string = "";
		try {
			var auth_service = new AuthService();
			var nm_info = await auth_service.getPluginInfoViaEC(
				this.environment.NM_UNIQUE_NAME
			);
			result = `${nm_info.data?.baseUrl}:${nm_info.data?.uiport}${this.environment.NM_UI_ENDPOINTS.notification_viewer}?hide_sidebar=true&msg_app_key=${this.environment.NM_APP_KEY}`;
		} catch (error) {
			throw error;
		}
		return result;
	}
}
