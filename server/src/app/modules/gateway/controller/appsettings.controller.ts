import express from "express";
import { ActionRes } from "../../global/models/actionres.model";
import { AppSettingsModel } from "../models/appsettings.model";
import { AppSettingsService } from "../service/appsettings.service";
import * as _ from "lodash";

const router = express.Router();

router.get("/entity", async (req, res, next) => {
	try {
		var result: ActionRes<AppSettingsModel> = new ActionRes<AppSettingsModel>(
			{
				item: new AppSettingsModel(),
			}
		);
		next(result);
	} catch (error) {
		next(error);
	}
});

router.post("/get", async (req, res, next) => {
	try {
		var app_settings_temp: AppSettingsModel = new AppSettingsModel(
			req.body.item
		);
		var _service = new AppSettingsService();
		var _settings = await _service.getSettings(app_settings_temp.type);
		var result: ActionRes<any> = new ActionRes<any>({
			item: _settings,
		});
		next(result);
	} catch (error) {
		next(error);
	}
});
router.post("/save", async (req, res, next) => {
	try {
		var app_settings_temp: AppSettingsModel = new AppSettingsModel(
			req.body.item
		);
		var _service = new AppSettingsService();
		var _settings = await _service.saveSettings(app_settings_temp);
		var result: ActionRes<any> = new ActionRes<any>({
			item: _settings,
		});
		next(result);
	} catch (error) {
		next(error);
	}
});

export { router as AppSettingsController };
