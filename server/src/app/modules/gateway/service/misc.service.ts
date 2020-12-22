import { using, Environment } from "../../global/utils";
import { BaseService } from "./base.service";
import * as _ from "lodash";
import { ErrorResponse } from "../../global/models/errorres.model";
import moment from "moment";
import { AuthService } from "../../auth/service/auth.service";
import { UserSessionService } from "../../auth/service/usersession.service";
import { UserSession } from "../../auth/models/usersession.model";
import axios, { AxiosResponse } from "axios";
import {
	ECHierarchyNode,
	FeatureMiscModel,
	ISASHierarchyNode,
	ISASPrivilege,
	PluginInfoMiscModel,
} from "../models/misc.model";
export class MiscService extends BaseService {
	constructor() {
		super();
		this.environment = new Environment();
	}
	environment: Environment;
	async getECHierarchy() {
		var result: Array<ECHierarchyNode> = [];
		try {
			var auth_service = new AuthService();

			var config = {
				headers: {
					"Content-Type": "application/json",
					Accept: "application/json",
					accesstoken: auth_service.generateHMAC(),
				},
			};
			var ec_url = this.environment.EC_URL;
			var url = `${ec_url}${this.environment.EC_API_ENDPOINTS.hierarchy}`;
			var resp = await axios.get(url, config);
			if (!(resp.data["responseCode"] == 0)) {
				throw new ErrorResponse({
					source: resp,
					item: resp.data,
				});
			}
			if (_.has(resp, "data.data.hierarchyTree")) {
				result = this.extractNodes(resp.data.data.hierarchyTree);
			}
		} catch (error) {
			if (_.get(error, "isAxiosError", false))
				throw new ErrorResponse({
					source: error,
					item: _.get(error, "response.data", null),
				});
			else {
				throw error;
			}
		}
		return result;
	}
	extractNodes(
		tree: Array<any>,
		extracted_nodes: Array<ECHierarchyNode> = []
	) {
		_.forEach(tree, (v) => {
			extracted_nodes.push(new ECHierarchyNode(v));
			if (v.children) {
				this.extractNodes(v.children, extracted_nodes);
			}
		});
		return extracted_nodes;
	}
	async getISASSitePermission(people_id: number) {
		var result: Array<ISASHierarchyNode> = [];
		try {
			var usersession_service = new UserSessionService();
			var usersession_list = await usersession_service.getUserSessionOrderByModifiedOn(
				new UserSession({
					people_id,
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
				_.forEach(resp.data.SitePermissionResponse.Sites, (v) => {
					var temp: ISASHierarchyNode = new ISASHierarchyNode();
					temp.Id = v.Site.Id;
					temp.Name = v.Site.Name;
					temp.ParentId = v.Site.ParentId;
					temp.Uid = v.Site.Uid;
					temp.MappedPrivileges = _.map(
						v.Site.MappedPrivileges,
						(v) => {
							return new ISASPrivilege({
								Key: v.Privilege.Key,
								Name: v.Privilege.Name,
							});
						}
					);
					result.push(temp);
				});
			}
		} catch (e) {
			var error = e;
			throw error;
		}
		return result;
	}
	async getUserISASToken(people_id: number) {
		var result: string = "";
		try {
			var usersession_service = new UserSessionService();
			var usersession_list = await usersession_service.getUserSessionOrderByModifiedOn(
				new UserSession({
					people_id,
				})
			);
			if (usersession_list.length == 0) {
				throw new ErrorResponse({
					message: "User session not found",
				});
			}
			var usersession = usersession_list[0];
			result = usersession.isas_access_token;
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
		} catch (err) {
			var error = err;
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
