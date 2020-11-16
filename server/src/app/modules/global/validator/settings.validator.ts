import * as _ from "lodash";
import { BaseValidator } from "./base.validator";
import { ErrorResponse } from "../../global/models/errorres.model";

export class SettingsValidator extends BaseValidator {
	constructor() {
		super();
	}
	// token(_auth: Auth) {
	// 	var auth = new Auth(_auth);
	// 	try {
	// 		if (_.get(auth, "refresh_token", "") == "") {
	// 			throw "refresh_token not supplied / invalid";
	// 		}
	// 	} catch (error) {
	// 		if (typeof error == "string") {
	// 			throw new ErrorResponse({
	// 				message: error,
	// 			});
	// 		}
	// 		throw error;
	// 	}
	// }
	
}
