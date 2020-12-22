import express from "express";
import { ActionRes } from "../../global/models/actionres.model";
import { DriverModel } from "../models/driver.model";
import { DriverService } from "../service/driver.service";
import { PeopleModel } from "../models/people.model";
import { PeopleService } from "../service/people.service";
import * as _ from "lodash";
import {
	DevicePeopleModel,
	DevicePeopleModelCriteria,
} from "../models/devicepeople.model";
import { DeviceModel } from "../models/device.model";
import { notification_messages } from "../utils/notificationmessages";

const router = express.Router();

router.get("/entity", async (req, res, next) => {
	try {
		var result: ActionRes<PeopleModel> = new ActionRes<PeopleModel>({
			item: new PeopleModel(),
		});
		next(result);
	} catch (error) {
		next(error);
	}
});

// router.get("/", async (req, res, next) => {
// 	try {
// 		var _people_service = new PeopleService();
// 		var _people = await _people_service.getPeople(
// 			new PeopleModel({
// 				people_type: PeopleModel.PEOPLE_TYPE.all,
// 			})
// 		);
// 		var result: ActionRes<Array<PeopleModel>> = new ActionRes<
// 			Array<PeopleModel>
// 		>({
// 			item: _people,
// 		});
// 		next(result);
// 	} catch (error) {
// 		next(error);
// 	}
// });
router.post("/get", async (req, res, next) => {
	try {
		var page = parseInt(_.get(req, "query.page", "1"));
		var size = parseInt(_.get(req, "query.size", "10"));
		var _people_service = new PeopleService();
		var { items, total_count } = await _people_service.getWithPagination(
			new PeopleModel(req.body.item),
			page,
			size
		);
		var result: ActionRes<Array<PeopleModel>> = new ActionRes<
			Array<PeopleModel>
		>({
			item: items,
			total_count,
		});
		next(result);
	} catch (error) {
		next(error);
	}
});

router.post("/update", async (req, res, next) => {
	try {
		var _people_service = new PeopleService();

		var people = await _people_service.UpdatePeople(
			new PeopleModel({
				...req.body.item,
				modified_by: (req.body.item as PeopleModel).id,
			})
		);
		var result: ActionRes<PeopleModel> = new ActionRes<PeopleModel>({
			item: people,
		});
		next(result);
	} catch (error) {
		next(error);
	}
});
router.post("/associate", async (req, res, next) => {
	try {
		var _people_service = new PeopleService();
		var device_people = new DevicePeopleModelCriteria(req.body.item);

		var is_associated = await _people_service.associate(
			req.body.decoded as PeopleModel,
			device_people
		);
		var result: ActionRes<boolean> = new ActionRes<boolean>({
			item: is_associated,
		});
		switch (device_people.device_type) {
			case DeviceModel.DeviceTypes.dexcom:
				result.notification = notification_messages.associate_dexcom(
					device_people.people_external_id,
					device_people.device_serial_no
				);
				break;
			case DeviceModel.DeviceTypes.idh:
				result.notification = notification_messages.associate_IDH(
					device_people.people_external_id,
					device_people.device_serial_no
				);
				break;

			default:
				break;
		}
		next(result);
	} catch (error) {
		next(error);
	}
});
router.post("/dissociate", async (req, res, next) => {
	try {
		var _people_service = new PeopleService();
		var device_people = new DevicePeopleModelCriteria(req.body.item);

		var is_dissociated = await _people_service.disssociate(
			req.body.decoded as PeopleModel,
			device_people
		);
		var result: ActionRes<boolean> = new ActionRes<boolean>({
			item: is_dissociated,
		});
		switch (device_people.device_type) {
			case DeviceModel.DeviceTypes.dexcom:
				result.notification = notification_messages.dissociate_dexcom(
					device_people.people_external_id,
					device_people.device_serial_no
				);
				break;
			case DeviceModel.DeviceTypes.idh:
				result.notification = notification_messages.dissociate_idh(
					device_people.people_external_id,
					device_people.device_serial_no
				);
				break;

			default:
				break;
		}
		next(result);
	} catch (error) {
		next(error);
	}
});
router.post("/getassociations", async (req, res, next) => {
	try {
		var _people_service = new PeopleService();
		var _device_people = await _people_service.getDevicePeople(
			new DevicePeopleModelCriteria(req.body.item)
		);
		var result: ActionRes<Array<DevicePeopleModelCriteria>> = new ActionRes<
			Array<DevicePeopleModelCriteria>
		>({
			item: _device_people,
		});
		next(result);
	} catch (error) {
		next(error);
	}
});

router.get("/patients/:id?/devices", async (req, res, next) => {
	try {
		var _patient_identifier = _.get(req, "params.id", "");
		var _people_service = new PeopleService();
		var _device_people = await _people_service.getDevicePeople(
			new DevicePeopleModelCriteria({
				// people_id: _patient_identifier,
				people_external_id: _patient_identifier,
			})
		);
		var result: ActionRes<Array<DevicePeopleModelCriteria>> = new ActionRes<
			Array<DevicePeopleModelCriteria>
		>({
			item: _device_people,
		});
		next(result);
	} catch (error) {
		next(error);
	}
});

router.get("/patients/:id?/associateddevices", async (req, res, next) => {
	try {
		var _patient_identifier = _.get(req, "params.id", "");
		var _people_service = new PeopleService();
		var _device_people = await _people_service.getAssociatedDevices(
			new DevicePeopleModelCriteria({
				// people_id: _patient_identifier,
				people_external_id: _patient_identifier,
			})
		);
		var result: ActionRes<Array<DevicePeopleModelCriteria>> = new ActionRes<
			Array<DevicePeopleModelCriteria>
		>({
			item: _device_people,
		});
		next(result);
	} catch (error) {
		next(error);
	}
});
router.get("/patients/:id?", async (req, res, next) => {
	try {
		var _patient_identifier = _.get(req, "params.id", "");
		var _people_service = new PeopleService();
		var _people = await _people_service.getPeople(
			new PeopleModel({
				external_id: _patient_identifier,
				people_type: PeopleModel.PEOPLE_TYPE.patient,
			})
		);
		var result: ActionRes<Array<PeopleModel>> = new ActionRes<
			Array<PeopleModel>
		>({
			item: _people,
		});
		next(result);
	} catch (error) {
		next(error);
	}
});
export { router as PeopleController };
