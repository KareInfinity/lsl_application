import * as _ from "lodash";
import { BaseValidator } from "./base.validator";
import { ErrorResponse } from "../../global/models/errorres.model";
import { Auth } from "../models/auth.model";

export class AuthValidator extends BaseValidator {
	constructor() {
		super();
	}
	token(_auth: Auth) {
		var auth = new Auth(_auth);
		try {
			if (_.get(auth, "refresh_token", "") == "") {
				throw "refresh_token not supplied / invalid";
			}
		} catch (error) {
			if (typeof error == "string") {
				throw new ErrorResponse({
					message: error,
				});
			}
			throw error;
		}
	}
	logout(_auth: Auth) {
		var auth = new Auth(_auth);
		try {
			if (_.get(auth, "refresh_token", "") == "") {
				throw "refresh_token not supplied / invalid";
			}
		} catch (error) {
			if (typeof error == "string") {
				throw new ErrorResponse({
					message: error,
				});
			}
			throw error;
		}
	}
}
