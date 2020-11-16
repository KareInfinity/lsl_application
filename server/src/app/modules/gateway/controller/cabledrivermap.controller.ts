import express from "express";
import { ActionRes } from "../../global/models/actionres.model";
import { CableModel } from "../models/cable.model";
import { CableService } from "../service/cable.service";
import { CableDriverMapService } from "../service/cabledrivermap.service";
import {
	CableDriverMapModel,
	CableDriverMapModelCriteria,
} from "../models/cabledrivermap.model";
import * as _ from "lodash";
const router = express.Router();

router.get("/entity", async (req, res, next) => {
	try {
		var result: ActionRes<CableDriverMapModel> = new ActionRes<
			CableDriverMapModel
		>({
			item: new CableDriverMapModel(),
		});
		next(result);
	} catch (error) {
		next(error);
	}
});

router.post("/get", async (req, res, next) => {
	try {
		var _service = new CableDriverMapService();
		var cable_driver_map_list: Array<CableDriverMapModel> = await _service.get(
			new CableDriverMapModel(_.get(req, "body.item", {}))
		);
		var result: ActionRes<Array<CableDriverMapModel>> = new ActionRes<
			Array<CableDriverMapModel>
		>({
			item: cable_driver_map_list,
		});
		next(result);
	} catch (error) {
		next(error);
	}
});
router.post("/", async (req, res, next) => {
	try {
		var _service = new CableDriverMapService();
		var cable_driver_map: CableDriverMapModel = await _service.save(
			new CableDriverMapModel(req.body.item)
		);
		var result: ActionRes<CableDriverMapModel> = new ActionRes<
			CableDriverMapModel
		>({
			item: cable_driver_map,
		});
		next(result);
	} catch (error) {
		next(error);
	}
});
router.post("/savebulk", async (req, res, next) => {
	try {
		var _service = new CableDriverMapService();
		var cable_driver_map_list: Array<CableDriverMapModelCriteria> = await _service.saveBulk(
			req.body.item
		);
		var result: ActionRes<Array<
			CableDriverMapModelCriteria
		>> = new ActionRes<Array<CableDriverMapModelCriteria>>({
			item: cable_driver_map_list,
		});
		next(result);
	} catch (error) {
		next(error);
	}
});

export { router as CableDriverMapController };
