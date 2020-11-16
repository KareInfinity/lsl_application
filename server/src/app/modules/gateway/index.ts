import express from "express";
import { GatewayRoutes } from "./controller";
import { ErrorResponse } from "../global/models/errorres.model";
import { logger } from "./utils";
import log4js from "log4js";
import { ActionRes } from "../global/models/actionres.model";
import { NotificationMessage } from "../global/models/notificationmessage.model";
import * as _ from "lodash";
import NotificationService from "./service/notification.service";
const router = express.Router();
router.use(
	log4js.connectLogger(logger, {
		level: "auto",
	})
);
router.use("/", GatewayRoutes);
/* Notification Handler */
router.use(async (item: any, req: any, res: any, next: any) => {
	if (_.get(item, "notification", null) != null) {
		if (_.get(item, "error_message", "") != "")
			item.notification.msg_text =
				item.notification.msg_text + ",because " + item.error_message;
		var service: NotificationService = new NotificationService();
		if (item.notification.msg_additional_data == "")
			item.notification.msg_additional_data = JSON.stringify(item.item);
		service.sendNotification(new NotificationMessage(item.notification));
		delete item.notification;
	}
	next(item);
});
/* response handler */
router.use((data: any, req: any, res: any, next: any) => {
	if (data instanceof ActionRes) {
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

export { router as GatewayModule };
