import express from "express";
import { ActionRes } from "../../global/models/actionres.model";
import { Auth } from "../models/auth.model";
import { AuthService } from "../service/auth.service";
import { AuthValidator } from "../validator/auth.validator";
const router = express.Router();
router.get("/entity", async (req, res, next) => {
	try {
		var result: ActionRes<Auth> = new ActionRes<Auth>({
			item: new Auth({}),
		});
		next(result);
	} catch (error) {
		next(error);
	}
});
router.post("/login", async (req, res, next) => {
	try {
		var auth_service = new AuthService();
		var auth = await auth_service.userLogin(new Auth(req.body.item));
		var result: ActionRes<Auth> = new ActionRes<Auth>({
			item: auth,
		});

		next(result);
	} catch (error) {
		next(error);
	}
});
router.post("/token", async (req, res, next) => {
	try {
		var auth_validator = new AuthValidator();
		auth_validator.token(req.body.item);
		var auth_service = new AuthService();
		var auth = await auth_service.refreshToken(new Auth(req.body.item));
		var result: ActionRes<Auth> = new ActionRes<Auth>({
			item: auth,
		});

		next(result);
	} catch (error) {
		next(error);
	}
});
router.post("/logout", async (req, res, next) => {
	try {
		var auth_validator = new AuthValidator();
		auth_validator.logout(req.body.item);
		var auth_service = new AuthService();
		var auth = await auth_service.userLogout(new Auth(req.body.item));
		var result: ActionRes<boolean> = new ActionRes<boolean>({
			item: auth,
		});

		next(result);
	} catch (error) {
		next(error);
	}
});
router.get("/getHMAC", async (req, res, next) => {
	try {
		var auth_service = new AuthService();
		var auth: string = await auth_service.generateAuthorizationHeader();
		var result: ActionRes<string> = new ActionRes<string>({
			item: auth,
		});

		next(result);
	} catch (error) {
		next(error);
	}
});
export { router as AuthController };
