import express from "express";
import { AuthController } from "./auth.controller";
import { checkToken } from "../middleware/auth.middleware";
import { UserSessionController } from "./usersession.controller";
const router = express.Router();

router.use("/user", AuthController);
router.use("/usersession", UserSessionController);


export { router as AuthRoutes };