import express from "express";
import { ActionRes } from "../../global/models/actionres.model";
import { DeviceService } from "../service/device.service";
import {
	DeviceModel,
	DeviceModelCriteria,
	DeviceSoftwareVersionCriteria,
} from "../models/device.model";
const router = express.Router();
import * as _ from "lodash";
import { notification_messages } from "../utils/notificationmessages";
import { PeopleModel } from "../models/people.model";

router.get("/entity", async (req, res, next) => {
	try {
		var result: ActionRes<DeviceModel> = new ActionRes<DeviceModel>({
			item: new DeviceModel(),
		});
		next(result);
	} catch (error) {
		next(error);
	}
});
router.post("/save", async (req, res, next) => {
	try {
		var service = new DeviceService();
		var device = await service.save(
			new DeviceModel({
				...req.body.item,
				created_by: _.get(req, "body.decoded.id", 0),
			})
		);
		var result: ActionRes<DeviceModel> = new ActionRes<DeviceModel>({
			item: device,
		});
		next(result);
	} catch (error) {
		next(error);
	}
});
router.post("/savebulk", async (req, res, next) => {
	try {
		var service = new DeviceService();
		var device_list = await service.saveBulk(
			req.body.item,
			_.get(req, "body.decoded.id", 0)
		);
		var result: ActionRes<Array<DeviceModelCriteria>> = new ActionRes<
			Array<DeviceModelCriteria>
		>({
			item: device_list,
		});
		next(result);
	} catch (error) {
		next(error);
	}
});
router.put("/save", async (req, res, next) => {
	try {
		var service = new DeviceService();
		var device = await service.update(
			new DeviceModel({
				...req.body.item,
				created_by: _.get(req, "body.decoded.id", 0),
				modified_by: _.get(req, "body.decoded.id", 0),
			})
		);
		var result: ActionRes<DeviceModel> = new ActionRes<DeviceModel>({
			item: device,
			notification: notification_messages.device_modify(
				device.device_type,
				(req.body.decoded as PeopleModel).external_id
			),
		});
		next(result);
	} catch (error) {
		next(error);
	}
});
/* router.post("/", async (req, res, next) => {
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
}); */
router.post("/dashboard", async (req, res, next) => {
	try {
		var _device_service = new DeviceService();
		var _device_tmp = await _device_service.dashboard(
			new DeviceModelCriteria(req.body.item)
		);
		var result: ActionRes<Array<DeviceModel>> = new ActionRes<
			Array<DeviceModel>
		>({
			item: _device_tmp,
		});
		next(result);
	} catch (error) {
		next(error);
	}
});

router.get("/devicetypes", async (req, res, next) => {
	try {
		var _device_service = new DeviceService();
		var _device_types = await _device_service.getDistinctDeviceTypes();
		var result: ActionRes<Array<string>> = new ActionRes<Array<string>>({
			item: _device_types,
		});
		next(result);
	} catch (error) {
		next(error);
	}
});
router.post("/getWithPagination", async (req, res, next) => {
	try {
		var page = parseInt(_.get(req, "query.page", "1"));
		var size = parseInt(_.get(req, "query.size", "10"));
		var _device_service = new DeviceService();
		var { items, total_count } = await _device_service.getWithPagination(
			new DeviceModelCriteria(req.body.item),
			page,
			size
		);
		var result: ActionRes<Array<DeviceModelCriteria>> = new ActionRes<
			Array<DeviceModelCriteria>
		>({
			item: items,
			total_count,
		});
		next(result);
	} catch (error) {
		next(error);
	}
});
router.post("/get", async (req, res, next) => {
	try {
		var _device_service = new DeviceService();
		var device_list = await _device_service.get(
			new DeviceModelCriteria(req.body.item)
		);
		var result: ActionRes<Array<DeviceModelCriteria>> = new ActionRes<
			Array<DeviceModelCriteria>
		>({
			item: device_list,
		});
		next(result);
	} catch (error) {
		next(error);
	}
});
router.post("/getDeviceSoftwareVersion", async (req, res, next) => {
	try {
		var _device_service = new DeviceService();
		var list = await _device_service.getDeviceSoftwareVersion(
			new DeviceSoftwareVersionCriteria(req.body.item)
		);
		var result: ActionRes<
			Array<DeviceSoftwareVersionCriteria>
		> = new ActionRes<Array<DeviceSoftwareVersionCriteria>>({
			item: list,
		});
		next(result);
	} catch (error) {
		next(error);
	}
});
router.get("/:id?", async (req, res, next) => {
	try {
		var _device_identifier = _.get(req, "params.id", "");
		var _device_service = new DeviceService();
		var _devices = await _device_service.get(
			new DeviceModelCriteria({ serial_no: _device_identifier })
		);
		var result: ActionRes<Array<DeviceModel>> = new ActionRes<
			Array<DeviceModel>
		>({
			item: _devices,
		});
		next(result);
	} catch (error) {
		next(error);
	}
});

export { router as DeviceController };
