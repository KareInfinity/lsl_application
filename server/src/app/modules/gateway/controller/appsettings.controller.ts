import express from "express";
import { ActionRes } from "../../global/models/actionres.model";
import { AppSettingsModel } from "../models/appsettings.model";
import { AppSettingsService } from "../service/appsettings.service";
import * as _ from "lodash";

const router = express.Router();

router.get("/entity", async (req, res, next) => {
	try {
		var result: ActionRes<AppSettingsModel> = new ActionRes<AppSettingsModel>({
			item: new AppSettingsModel(),
		});
		next(result);
	} catch (error) {
		next(error);
	}
});

router.get("/:type", async (req, res, next) => {
	try {
		var _type = _.get(req, "params.type", "");
		var _service = new AppSettingsService();
		var _settings = await _service.getSettings(_type);
		var result: ActionRes<any> = new ActionRes<any>({
			item: _settings,
		});
		next(result);
	} catch (error) {
		next(error);
	}
});

export { router as AppSettingsController };
