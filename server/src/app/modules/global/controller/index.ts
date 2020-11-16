import express from "express";
import { SettingsController } from "./settings.controller";
const router = express.Router();

router.use("/settings", SettingsController);

export { router as GlobalRoutes };
