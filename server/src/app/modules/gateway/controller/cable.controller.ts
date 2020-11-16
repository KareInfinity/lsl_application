import express from "express";
import { ActionRes } from "../../global/models/actionres.model";
import { CableModel } from "../models/cable.model";
import { CableService } from "../service/cable.service";

const router = express.Router();

router.get("/entity", async (req, res, next) => {
	try {
		var result: ActionRes<CableModel> = new ActionRes<CableModel>({
			item: new CableModel(),
		});
		next(result);
	} catch (error) {
		next(error);
	}
});

router.get("/", async (req, res, next) => {
	try {
		var _driver_service = new CableService();
		var _driver = await _driver_service.getCable();
		var result: ActionRes<any> = new ActionRes<any>({
			item: _driver,
		});
		next(result);
	} catch (error) {
		next(error);
	}
});

router.post("/", async (req, res, next) => {
	try {
		var _cable_serivce = new CableService();
		var _cable_tmp = await _cable_serivce.insertCableInfo(req.body.item);
		var result: ActionRes<boolean> = new ActionRes<boolean>({
			item: _cable_tmp,
		});
		next(result);
	} catch (error) {
		next(error);
	}
});

router.put("/", async (req, res, next) => {
	try {
		var _cable_serivce = new CableService();
		var _cable_tmp = await _cable_serivce.updateCableInfo(req.body.item);
		var result: ActionRes<boolean> = new ActionRes<boolean>({
			item: _cable_tmp
		})
	} catch (error) {
		next(error);
	}
})

export { router as CableController };
