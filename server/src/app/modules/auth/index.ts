import express from "express";
import { AuthRoutes } from "./controller";
import { ErrorResponse } from "../global/models/errorres.model";
import { logger } from "./utils";
import log4js from "log4js";
import { ActionRes } from "../global/models/actionres.model";

const router = express.Router();
router.use(
	log4js.connectLogger(logger, {
		level: "auto",
	})
);
router.use("/", AuthRoutes);
/* response handler */
router.use((data: any, req: any, res: any, next: any) => {
	if (data instanceof ActionRes) {
		data.message = "modified";
		res.status(200).send(data);
	} else {
		next(data);
	}
});
/* error response handler */
router.use((err: any, req: any, res: any, next: any) => {
	var error_log_data =
		req.connection.remoteAddress +
		`\t${req.method} ${req.url}` +
		(req.body ? "\t[REQUEST_BODY] " + JSON.stringify(req.body) : "") +
		"\t[ERROR_OBJECT] " +
		JSON.stringify(err);
	if (err instanceof ErrorResponse) {
		var TAG = "[HANDLED_FAILURE]\t";
		logger.error(TAG + error_log_data);
		res.status(400).send(err);
	} else {
		var TAG = "[UNHANDLED_FAILURE]\t";
		logger.error(TAG + error_log_data);
		next(err);
	}
});

export { router as AuthModule };
