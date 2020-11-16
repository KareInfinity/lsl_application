import express from "express";
import { ActionRes } from "../../global/models/actionres.model";
import { DeviceValuesService } from "../service/devicevalues.service";
import { CustomDeviceValues } from "../models/devicevalues.model";
import * as _ from "lodash";
import {
	DeviceBatteryValues,
	DeviceBatteryValuesCriteria,
} from "../models/devicebatteryvalues.model";
import { DeviceNetworkValues } from "../models/devicenetworkvalues.model";
import {
	IDHSessionsModel,
	IDHSessionsModelCriteria,
} from "../models/idhsessions.model";
import { notification_messages } from "../utils/notificationmessages";
const router = express.Router();

router.get("/entity", async (req, res, next) => {
	try {
		var result: ActionRes<CustomDeviceValues> = new ActionRes<
			CustomDeviceValues
		>({
			item: new CustomDeviceValues(),
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

router.post("/getIDHSessionsHistory", async (req, res, next) => {
	try {
		var _device_values_service = new DeviceValuesService();
		var _device_tmp = await _device_values_service.getIDHSessionHistory(
			new IDHSessionsModelCriteria(req.body.item)
		);
		var result: ActionRes<Array<IDHSessionsModel>> = new ActionRes<
			Array<IDHSessionsModel>
		>({
			item: _device_tmp,
		});
		next(result);
	} catch (error) {
		next(error);
	}
});

router.post("/getDeviceValuesHistory", async (req, res, next) => {
	try {
		var _device_values_service = new DeviceValuesService();
		var _device_tmp = await _device_values_service.getDeviceValuesHistory(
			new CustomDeviceValues(req.body.item)
		);
		var result: ActionRes<Array<CustomDeviceValues>> = new ActionRes<
			Array<CustomDeviceValues>
		>({
			item: _device_tmp,
		});
		next(result);
	} catch (error) {
		next(error);
	}
});

router.post("/getDeviceBatteryValuesHistory", async (req, res, next) => {
	try {
		var _device_values_service = new DeviceValuesService();
		var _device_tmp = await _device_values_service.getDeviceBatteryValuesHistory(
			new DeviceBatteryValuesCriteria(req.body.item)
		);
		var result: ActionRes<Array<DeviceBatteryValues>> = new ActionRes<
			Array<DeviceBatteryValues>
		>({
			item: _device_tmp,
		});
		next(result);
	} catch (error) {
		next(error);
	}
});

router.post("/getDeviceNetworkValuesHistory", async (req, res, next) => {
	try {
		var from_date: Date = _.has(req, "query.from_date")
			? new Date(req.query.from_date as string)
			: new Date();
		var to_date: Date = _.has(req, "query.to_date")
			? new Date(req.query.to_date as string)
			: new Date();
		var _device_values_service = new DeviceValuesService();
		var _device_tmp = await _device_values_service.getDeviceNetworkValuesHistory(
			new DeviceNetworkValues(req.body.item),
			from_date,
			to_date
		);
		var result: ActionRes<Array<DeviceNetworkValues>> = new ActionRes<
			Array<DeviceNetworkValues>
		>({
			item: _device_tmp,
		});
		next(result);
	} catch (error) {
		next(error);
	}
});

export { router as DeviceValuesController };
