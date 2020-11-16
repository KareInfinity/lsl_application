import express from "express";
import { ActionRes } from "../../global/models/actionres.model";
import { DriverModel } from "../models/driver.model";
import { DriverService } from "../service/driver.service";

const router = express.Router();

router.get("/entity", async (req, res, next) => {
    try {
        var result: ActionRes<DriverModel> = new ActionRes<DriverModel>({
            item: new DriverModel(),
        });
        next(result);
    } catch (error) {
        next(error);
    }
});

router.get("/", async (req, res, next) => {
    try {
        var _driver_service = new DriverService();
        var _driver = await _driver_service.getDriver();
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
        var _driver_service = new DriverService();
        var _driver_tmp = await _driver_service.insertDriverInfo(req.body.item);
        var result: ActionRes<boolean> = new ActionRes<boolean>({
            item: _driver_tmp,
        });
        next(result);
    } catch (error) {
        next(error);
    }
});

router.put("/", async (req, res, next) => {
    try {
        var _driver_service = new DriverService();
        var _driver_tmp = await _driver_service.updateDriverInfo(req.body.item);
        var result: ActionRes<boolean> = new ActionRes<boolean>({
            item: _driver_tmp
        })
    } catch (error) {
        next(error);
    }
})


export { router as DriverController };
