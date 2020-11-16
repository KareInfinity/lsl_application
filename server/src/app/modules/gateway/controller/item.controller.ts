import express from "express";
import { ActionRes } from "../../global/models/actionres.model";
import { ItemRequest, ItemResponse } from "../models/item.model";
import { result } from "lodash";
import { ItemService } from "../service/item.service";
import { DeviceModel } from "../models/device.model";
const router = express.Router();

router.get("/entity", (req, res, next) => {
	var result: ActionRes<ItemRequest> = new ActionRes<ItemRequest>({
		item: new ItemRequest(),
	});
	next(result);
});

router.post("/get", async (req, res, next) => {
	try {
		var service = new ItemService();
		var item: ItemResponse<DeviceModel> = await service.get(
			new ItemRequest(req.body.item)
		);
		var result: ActionRes<ItemResponse<DeviceModel>> = new ActionRes<
			ItemResponse<DeviceModel>
		>({
			item,
		});
		next(result);
	} catch (e) {
		next(e);
	}
});

export { router as ItemController };
