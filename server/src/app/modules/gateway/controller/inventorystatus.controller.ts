import express from "express";
import { ActionRes } from "../../global/models/actionres.model";
import {
	DeviceInventoryStatusModel,
	InventoryStatusModel,
} from "../models/inventorystatus.model";
import { DeviceInventoryStatusService } from "../service/deviceinventorystatus.service";

const router = express.Router();

router.get("/entity", async (req, res, next) => {
	try {
		var result: ActionRes<InventoryStatusModel> = new ActionRes<InventoryStatusModel>(
			{
				item: new InventoryStatusModel(),
			}
		);
		next(result);
	} catch (error) {
		next(error);
	}
});

router.post("/get", async (req, res, next) => {
	try {
		var _service = new DeviceInventoryStatusService();
		var _response = await _service.getInventoryStatuseList(req.body.item);
		var result: ActionRes<Array<InventoryStatusModel>> = new ActionRes<
			Array<InventoryStatusModel>
		>({
			item: _response,
		});
		next(result);
	} catch (error) {
		next(error);
	}
});

router.post("/save", async (req, res, next) => {
	try {
		var service = new DeviceInventoryStatusService();
		var response = await service.saveInventoryStatus(req.body.item);
		var result: ActionRes<InventoryStatusModel> = new ActionRes<InventoryStatusModel>(
			{
				item: response,
			}
		);
		next(result);
	} catch (error) {
		next(error);
	}
});
router.put("/save", async (req, res, next) => {
	try {
		var service = new DeviceInventoryStatusService();
		var response = await service.updateInventoryStatus(req.body.item);
		var result: ActionRes<InventoryStatusModel> = new ActionRes<InventoryStatusModel>(
			{
				item: response,
			}
		);
		next(result);
	} catch (error) {
		next(error);
	}
});
router.post("/delete", async (req, res, next) => {
	try {
		var service = new DeviceInventoryStatusService();
		var response = await service.deleteInventoryStatus(req.body.item);
		var result: ActionRes<InventoryStatusModel> = new ActionRes<InventoryStatusModel>(
			{
				item: response,
			}
		);
		next(result);
	} catch (error) {
		next(error);
	}
});

export { router as InventoryStatusController };
