import express from "express";
import { checkToken } from "../../auth/middleware/auth.middleware";
import { DeviceController } from "./device.controller";
import { Environment } from "../../global/utils";
import { DeviceValuesController } from "./devicevalues.controller";
import { DriverController } from "./driver.controller";
import { CableController } from "./cable.controller";
import { PeopleController } from "./people.controller";
import { CableDriverMapController } from "./cabledrivermap.controller";
import { ItemController } from "./item.controller";
import { ReferenceListController } from "./referencelist.controller";
import { HL7HandlerController } from "./hl7handler.controller";
import { UI } from "bull-board";
import { MiscController } from "./misc.controller";
import { checkISASToken } from "../../auth/middleware/isas.middleware";

const router = express.Router();
const environment = Environment.getInstance();
router.use("/queue", UI);
router.use("/hl7handler", HL7HandlerController);
if (environment.AUTH) {
	router.use(checkISASToken);
	router.use(checkToken);
}
router.use("/v1/people", PeopleController);
router.use("/v1/devices", DeviceController);
router.use("/devicevalues", DeviceValuesController);
router.use("/driver", DriverController);
router.use("/cable", CableController);
router.use("/cabledrivermap", CableDriverMapController);
router.use("/misc", MiscController);

router.use("/item", ItemController);
router.use("/referencedata", ReferenceListController);
export { router as GatewayRoutes };
