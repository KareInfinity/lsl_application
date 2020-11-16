import * as _ from "lodash";
import { Response } from "express";
import { ErrorResponse } from "../../global/models/errorres.model";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model";
import { AuthService } from "../service/auth.service";
import { UserSession } from "../models/usersession.model";
const checkISASToken = async (req: any, res: Response, next: any) => {
	try {
		let isas_access_token = req.headers["isas-access-token"];
		if (isas_access_token) {
			var auth_service = new AuthService();
			var usersession = await auth_service.validateISASUserToken(
				new UserSession({
					isas_access_token,
				})
			);
			req.headers["authorization"] = usersession.lsl_access_token;
			next();
		} else {
			next();
		}
	} catch (error) {
		res.status(401).send(error);
	}
};
export { checkISASToken };
