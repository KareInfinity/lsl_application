import express from "express";
import { ActionRes } from "../../global/models/actionres.model";
const router = express.Router();
import * as _ from "lodash";
import { MiscService } from "../service/misc.service";
import { FeatureMiscModel } from "../models/misc.model";
import { AuthService } from "../../auth/service/auth.service";

router.get("/ISASSitePermission", async (req, res, next) => {
	try {
		var service = new MiscService();
		var site_info = await service.getISASSitePermission(
			_.get(req, "body.decoded.id")
		);
		var result: ActionRes<any> = new ActionRes<any>({
			item: site_info,
		});
		next(result);
	} catch (error) {
		next(error);
	}
});

router.get("/ConfigurationDeviceList", async (req, res, next) => {
	try {
		var service = new MiscService();
		var device_list = await service.getConfigurationDeviceList();
		var result: ActionRes<Array<FeatureMiscModel>> = new ActionRes<
			Array<FeatureMiscModel>
		>({
			item: device_list,
		});
		next(result);
	} catch (error) {
		next(error);
	}
});
router.get("/getNotificationManagerViewerUrl", async (req, res, next) => {
	try {
		var service = new MiscService();
		var url = await service.getNotificationManagerViewerUrl();
		var result: ActionRes<string> = new ActionRes<string>({
			item: url,
		});
		next(result);
	} catch (error) {
		next(error);
	}
});
router.get("/getHMAC", async (req, res, next) => {
	try {
		var service = new AuthService();
		var hmac = await service.generateHMAC();
		var result: ActionRes<string> = new ActionRes<string>({
			item: hmac,
		});
		next(result);
	} catch (error) {
		next(error);
	}
});
// router.get("/entity", async (req, res, next) => {
// 	try {
// 		var result: ActionRes<DeviceModel> = new ActionRes<DeviceModel>({
// 			item: new DeviceModel(),
// 		});
// 		next(result);
// 	} catch (error) {
// 		next(error);
// 	}
// });
// router.post("/save", async (req, res, next) => {
// 	try {
// 		var service = new DeviceService();
// 		var device = await service.save(
// 			new DeviceModel({
// 				...req.body.item,
// 				created_by: _.get(req, "body.decoded.id", 0),
// 			})
// 		);
// 		var result: ActionRes<DeviceModel> = new ActionRes<DeviceModel>({
// 			item: device,
// 		});
// 		next(result);
// 	} catch (error) {
// 		next(error);
// 	}
// });

export { router as MiscController };
