import express from "express";
import { ActionRes } from "../../global/models/actionres.model";
import { UserSession } from "../models/usersession.model";
import { UserSessionService } from "../service/usersession.service";
const router = express.Router();
router.get("/entity", async (req, res, next) => {
	try {
		var result: ActionRes<UserSession> = new ActionRes<UserSession>({
			item: new UserSession(),
		});
		next(result);
	} catch (error) {
		next(error);
	}
});
router.post("/", async (req, res, next) => {
	try {
		var usersession_service = new UserSessionService();
		var usersession = await usersession_service.insert(
			new UserSession(req.body.item)
		);
		var result: ActionRes<UserSession> = new ActionRes<UserSession>({
			item: usersession,
		});

		next(result);
	} catch (error) {
		next(error);
	}
});
router.post("/get", async (req, res, next) => {
	try {
		var usersession_service = new UserSessionService();
		var usersession = await usersession_service.get(
			new UserSession(req.body.item)
		);
		var result: ActionRes<Array<UserSession>> = new ActionRes<
			Array<UserSession>
		>({
			item: usersession,
		});

		next(result);
	} catch (error) {
		next(error);
	}
});
router.put("/", async (req, res, next) => {
	try {
		var usersession_service = new UserSessionService();
		var usersession = await usersession_service.update(
			new UserSession(req.body.item)
		);
		var result: ActionRes<UserSession> = new ActionRes<UserSession>({
			item: usersession,
		});

		next(result);
	} catch (error) {
		next(error);
	}
});

export { router as UserSessionController };
