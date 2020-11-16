import { using, Environment, JwtHelper } from "../../global/utils";
import { BaseService } from "./base.service";
import * as _ from "lodash";
import { ErrorResponse } from "../../global/models/errorres.model";
import axios from "axios";
import crypto, { WordArray } from "crypto-js";
import moment from "moment";
import { Auth } from "../models/auth.model";
import { User } from "../models/user.model";
import { UserSessionService } from "./usersession.service";
import { UserSession } from "../models/usersession.model";
import jwt from "jsonwebtoken";
import { ECResponse, GetPluginInfoViaEC } from "../models/misc.model";
export class AuthService extends BaseService {
	JWT_SECRET = _.get(process, "env.JWT_SECRET", "SECRET");
	getToken(user: User, expiration_date: Date) {
		var token = "";
		try {
			var expiresIn = moment(expiration_date).diff(moment(), "s");
			token = jwt.sign(
				{ id: user.id, name: user.name },
				this.JWT_SECRET,
				{
					expiresIn,
				}
			);
		} catch (error) {
			throw error;
		}
		return token;
	}
	generateAuthorizationHeader() {
		var token = "";
		try {
			var hmac = this.generateHMAC();
			token = `Basic ${hmac}`;
		} catch (error) {
			throw error;
		}

		return token;
	}
	generateHMAC() {
		var token = "";
		try {
			var current_time_in_utc = moment().utc().format();
			var app_secret = this.environment.ISAS_APPLICATION_SECRET;
			var app_id = this.environment.ISAS_APPLICATION_ID;
			var step_1: string | WordArray = crypto
				.HmacSHA256(current_time_in_utc, app_secret)
				.toString();
			var step_2 = `${app_id}:${current_time_in_utc}:${step_1}`;
			step_2 = crypto.enc.Utf8.parse(step_2);
			var step_3 = crypto.enc.Base64.stringify(step_2).toString();
			token = `${step_3}`;
		} catch (error) {
			throw error;
		}

		return token;
	}
	getPluginInfoViaEC = async (plugin_name: string) => {
		let result: ECResponse<GetPluginInfoViaEC> = new ECResponse<
			GetPluginInfoViaEC
		>();
		try {
			var config = {
				headers: {
					accesstoken: await this.generateHMAC(),
					uniqueName: plugin_name,
				},
			};

			var ec_response = await axios.get(
				`${this.environment.EC_URL}${this.environment.EC_API_ENDPOINTS.plugins}`,
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
	async getISASURL() {
		var result: string = this.environment.ISAS_URL;
		try {
			if (result == "") {
				/* get ISAS Info from EC */
				var isas_info = await this.getPluginInfoViaEC(
					this.environment.ISAS_UNIQUE_NAME
				);
				/* store ISAS URL in ENV */
				this.environment._ISAS_URL =
					isas_info.data?.baseUrl + ":" + isas_info.data?.serverPort;

				result = this.environment.ISAS_URL;
			}
		} catch (error) {
			throw error;
		}
		return result;
	}
	async getISASSecurityModel() {
		try {
			var config = {
				headers: {
					"Content-Type": "application/json",
					Accept: "application/json",
					Authorization: this.generateAuthorizationHeader(),
				},
			};
			var isas_url = await this.getISASURL();
			var url = `${isas_url}${this.environment.ISAS_API_ENDPOINTS.get_security_model}`;
			var resp = await axios.get(url, config);
			if (_.has(resp, "data.SecurityModelDetailsResponse")) {
				resp = resp.data.SecurityModelDetailsResponse;
				this.environment._ISAS_SECURITY_MODEL = _.get(
					resp,
					"SecurityModel",
					""
				);
			}
		} catch (error) {
			var error_code = _.get(
				error,
				"response.data.SecurityModelDetailsResponse.ErrorCode",
				0
			);
			var error_message = _.get(
				error,
				"response.data.SecurityModelDetailsResponse.ErrorText",
				""
			);
			if (error_code != 0 && error_message != "") {
				throw new ErrorResponse({
					message: error_message,
				});
			}
			throw error;
		}
	}
	async isasLogin(_auth: Auth) {
		var result = new Auth();
		try {
			/* config */
			var config = {
				headers: {
					"Content-Type": "application/json",
					Accept: "application/json",
					Authorization: this.generateAuthorizationHeader(),
				},
			};
			/* post data */
			var post_data: any = null;
			var auth_type =
				_auth.type == null
					? this.environment.ISAS_SECURITY_MODEL
					: _auth.type;
			switch (auth_type) {
				case Auth.auth_types.ISAS:
					post_data = {
						AuthenticationRequest: {
							siteid: 1,
							AuthenticationType: Auth.auth_types.ISAS,
							AuthenticationMethod: Auth.auth_methods.PASSWORD,
							AuthenticationParameters: {
								username: _auth.param_1,
								Password: _auth.param_2,
							},
						},
					};
			}
			/* url */
			var isas_url = await this.getISASURL();
			var url = `${isas_url}${this.environment.ISAS_API_ENDPOINTS.user_login}`;
			var resp = await axios.post(url, post_data, config);
			if (_.has(resp, "data.AuthenticationResponse")) {
				var temp = resp.data.AuthenticationResponse;
				result.access_token = _.get(temp, "AccessToken", "");
				result.refresh_token = _.get(temp, "RefreshToken", "");
				result.access_token_expiry_time = new Date(
					temp.AccessToken_ExpiryTime
				);
				result.user = await this.introspectUser(
					new Auth({
						access_token: result.access_token,
					})
				);
			}
		} catch (error) {
			var error_code = _.get(
				error,
				"response.data.AuthenticationResponse.ErrorCode",
				0
			);
			var error_message = _.get(
				error,
				"response.data.AuthenticationResponse.ErrorText",
				""
			);
			if (error_code != 0 && error_message != "") {
				throw new ErrorResponse({
					message: error_message,
				});
			}
			throw error;
		}
		return result;
	}
	async introspectUser(_auth: Auth) {
		var result = new User();

		try {
			/* config */
			var config = {
				headers: {
					"Content-Type": "application/json",
					Accept: "application/json",
					Authorization: this.generateAuthorizationHeader(),
				},
			};
			/* post data */
			var post_data: any = {
				introspectrequest: {
					accesstoken: _auth.access_token,
				},
			};
			/* url */
			var isas_url = await this.getISASURL();
			var url = `${isas_url}${this.environment.ISAS_API_ENDPOINTS.user_introspect}`;
			var resp = await axios.post(url, post_data, config);
			if (_.has(resp, "data.IntrospectResponse.UserDetails")) {
				resp = resp.data.IntrospectResponse.UserDetails;
				result.id = _.get(resp, "Username", "");
				result.name = _.get(resp, "Username", "");
			}
		} catch (error) {
			var error_code = _.get(
				error,
				"response.data.IntrospectResponse.ErrorCode",
				0
			);
			var error_message = _.get(
				error,
				"response.data.IntrospectResponse.ErrorText",
				""
			);
			if (error_code != 0 && error_message != "") {
				throw new ErrorResponse({
					message: error_message,
				});
			}
			throw error;
		}
		return result;
	}
	async refreshISASToken(_auth: Auth) {
		var result = new Auth();
		try {
			/* config */
			var config = {
				headers: {
					"Content-Type": "application/json",
					Accept: "application/json",
					Authorization: this.generateAuthorizationHeader(),
				},
			};
			/* post data */
			var post_data: any = {
				newtokenrequest: {
					refreshtoken: _auth.refresh_token,
				},
			};
			/* url */
			var isas_url = await this.getISASURL();
			var url = `${isas_url}${this.environment.ISAS_API_ENDPOINTS.refresh_token}`;
			var resp = await axios.post(url, post_data, config);
			if (_.has(resp, "data.TokenResponse")) {
				var temp = resp.data.TokenResponse;
				result.access_token = _.get(temp, "AccessToken", "");
				result.refresh_token = _.get(temp, "RefreshToken", "");
				result.access_token_expiry_time = new Date(
					temp.AccessToken_ExpiryTime
				);
			}
		} catch (error) {
			var error_code = _.get(
				error,
				"response.data.TokenResponse.ErrorCode",
				0
			);
			var error_message = _.get(
				error,
				"response.data.TokenResponse.ErrorText",
				""
			);
			if (error_code != 0 && error_message != "") {
				throw new ErrorResponse({
					message: error_message,
				});
			}
			throw error;
		}
		return result;
	}
	async isasLogout(_auth: Auth) {
		var result: boolean = false;
		try {
			/* config */
			var config = {
				headers: {
					"Content-Type": "application/json",
					Accept: "application/json",
					Authorization: this.generateAuthorizationHeader(),
				},
			};
			/* post data */
			var post_data: any = {
				logoutRequest: {
					accesstoken: _auth.access_token,
				},
			};
			/* url */
			var isas_url = await this.getISASURL();
			var url = `${isas_url}${this.environment.ISAS_API_ENDPOINTS.user_logout}`;
			var resp = await axios.post(url, post_data, config);
			if (_.has(resp, "data.LogoutResponse")) {
				resp = resp.data.LogoutResponse;
				result = _.get(resp, "ErrorCode", 1) == 0 ? true : false;
			}
		} catch (error) {
			var error_code = _.get(
				error,
				"response.data.LogoutResponse.ErrorCode",
				0
			);
			var error_message = _.get(
				error,
				"response.data.LogoutResponse.ErrorText",
				""
			);
			if (error_code != 0 && error_message != "") {
				throw new ErrorResponse({
					message: error_message,
				});
			}
			throw error;
		}
		return result;
	}
	async userLogin(_auth: Auth) {
		var result = new Auth();
		try {
			var isas_login_resp = await this.isasLogin(_auth);
			var user = new User({
				id: isas_login_resp.user?.id,
				name: isas_login_resp.user?.id,
			});
			var usersession_service = new UserSessionService();
			var new_usersession = await usersession_service.insert(
				new UserSession({
					isas_access_token: isas_login_resp.access_token,
					isas_refresh_token: isas_login_resp.refresh_token,
					user_id: user.id,
					created_by: user.id,
					user_info: user,
				})
			);
			result.access_token = this.getToken(
				user,
				isas_login_resp.access_token_expiry_time
			);
			result.refresh_token = new_usersession.refresh_token;
			result.user = new_usersession.user_info;
		} catch (error) {
			throw error;
		}
		return result;
	}

	async refreshToken(_auth: Auth) {
		var result = new Auth();
		try {
			var usersession_service = new UserSessionService();
			var user_session:
				| UserSession
				| Array<UserSession> = await usersession_service.get(
				new UserSession({
					refresh_token: _auth.refresh_token,
				})
			);
			if (!_.has(user_session, "0")) {
				throw new ErrorResponse({
					message: "session invalid",
				});
			}
			user_session = user_session[0];
			/* throw error if usersession is expired */
			if ((user_session as UserSession).is_expired == true) {
				throw new ErrorResponse({ message: "session expired" });
			}
			/* refresh isas token */
			var isas_refresh_token_error = null;
			var isas_refresh_token_resp = await this.refreshISASToken(
				new Auth({
					refresh_token: user_session.isas_refresh_token,
				})
			).catch((error) => {
				isas_refresh_token_error = error;
			});
			/* error on refreshing isas token */
			if (isas_refresh_token_error != null) {
				/* set user session as expired */
				user_session.is_expired = true;
				user_session.killed_by = user_session.user_id;
				user_session.end_time = new Date();
				await usersession_service.update(user_session);
				/* throw error */
				throw isas_refresh_token_error;
			}
			/* update user session */
			user_session.isas_refresh_token = (isas_refresh_token_resp as Auth)
				.refresh_token as string;
			user_session.isas_access_token = (isas_refresh_token_resp as Auth)
				.access_token as string;
			var updated_user_session = await usersession_service.update(
				user_session
			);
			/* form result */
			result.access_token = this.getToken(
				user_session.user_info,
				(isas_refresh_token_resp as Auth).access_token_expiry_time
			);
			result.refresh_token = updated_user_session.refresh_token;
		} catch (error) {
			throw error;
		}
		return result;
	}
	async userLogout(_auth: Auth) {
		var result: boolean = false;
		try {
			var usersession_service = new UserSessionService();
			var user_session:
				| UserSession
				| Array<UserSession> = await usersession_service.get(
				new UserSession({
					refresh_token: _auth.refresh_token,
				})
			);
			if (!_.has(user_session, "0")) {
				throw new ErrorResponse({
					message: "token invalid",
				});
			}
			user_session = user_session[0];
			/* update session */
			user_session.is_expired = true;
			user_session.killed_by = user_session.user_id;
			user_session.end_time = new Date();
			await usersession_service.update(user_session);
			/* isas logout */
			var isas_logout_resp = await this.isasLogout(
				new Auth({
					access_token: user_session.isas_access_token,
				})
			);
			result = isas_logout_resp;
		} catch (error) {
			throw error;
		}
		return result;
	}
	async validateISASUserToken(_req: UserSession) {
		var result = new UserSession();
		try {
			var usersession_service = new UserSessionService();
			var usersession_list = await usersession_service.get(
				new UserSession({
					isas_access_token: _req.isas_access_token,
				})
			);
			if (usersession_list.length > 0) {
				result = usersession_list[0];
			} else {
				var user = await this.introspectUser(
					new Auth({ access_token: _req.isas_access_token })
				);
				var jwt_helper = new JwtHelper();
				var lsl_access_token = this.getToken(
					user,
					jwt_helper.getTokenExpirationDate(_req.isas_access_token)
				);
				result = await usersession_service.insert(
					new UserSession({
						isas_access_token: _req.isas_access_token,
						lsl_access_token,
						user_id: user.id,
						created_by: user.id,
						user_info: user,
					})
				);
			}
		} catch (error) {
			throw error;
		}
		return result;
	}
}
