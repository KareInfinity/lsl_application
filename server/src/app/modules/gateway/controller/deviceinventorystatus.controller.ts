import express from "express";
import { ActionRes } from "../../global/models/actionres.model";
import { DeviceInventoryStatusModel, InventoryStatusModel } from "../models/inventorystatus.model";
import { DeviceInventoryStatusService } from "../service/deviceinventorystatus.service";
import * as _ from "lodash";

const router = express.Router();

router.get("/entity", async (req, res, next) => {
    try {
        var result: ActionRes<DeviceInventoryStatusModel> = new ActionRes<DeviceInventoryStatusModel>({
            item: new DeviceInventoryStatusModel(),
        });
        next(result);
    } catch (error) {
        next(error);
    }
});

router.post("/get", async (req, res, next) => {
    try {
        var _service = new DeviceInventoryStatusService();
        var _response = await _service.getDeviceInventoryStatusList(req.body.item);
        var result: ActionRes<Array<DeviceInventoryStatusModel>> = new ActionRes<Array<DeviceInventoryStatusModel>>({
            item: _response,
        });
        next(result);
    } catch (error) {
        next(error);
    }
});

router.post("/", async (req, res, next) => {
    try {
        var _service = new DeviceInventoryStatusService();
        var _response = await _service.updateDeviceInventoryStatus(req.body.item);
        var result: ActionRes<boolean> = new ActionRes<boolean>({
            item: _response,
        });
        next(result);
    } catch (error) {
        next(error);
    }
});

/* router.put("/", async (req, res, next) => {
    try {
        var _driver_service = new DriverService();
        var _driver_tmp = await _driver_service.updateDriverInfo(req.body.item);
        var result: ActionRes<boolean> = new ActionRes<boolean>({
            item: _driver_tmp
        })
    } catch (error) {
        next(error);
    }
}) */

export { router as DeviceInventoryStatusController };
