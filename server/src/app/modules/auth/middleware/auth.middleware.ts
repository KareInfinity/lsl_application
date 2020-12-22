import * as _ from "lodash";
import { Response } from "express";
import { ErrorResponse } from "../../global/models/errorres.model";
import jwt from "jsonwebtoken";
import { PeopleModel } from "../../gateway/models/people.model";
const checkToken = async (req: any, res: Response, next: any) => {
	try {
		const JWT_SECRET = _.get(process, "env.JWT_SECRET", "SECRET");
		let access_token =
			req.headers["x-access-token"] || req.headers["authorization"]; // Express headers are auto converted to lowercase
		if (access_token) {
			if (access_token.startsWith("Bearer ")) {
				access_token = access_token.slice(7, access_token.length);
			}
			jwt.verify(access_token, JWT_SECRET, (err: any, decoded: any) => {
				if (err) {
					res.status(401).send(
						new ErrorResponse({
							message: "token invalid",
						})
					);
				} else {
					req.body.decoded = new PeopleModel(decoded);
					next();
				}
			});
		} else {
			res.status(401).send(
				new ErrorResponse({
					message: "token not supplied",
				})
			);
		}
	} catch (error) {
		res.status(401).send(error);
	}
};
export { checkToken };
