import express from "express";
import { ActionRes } from "../../global/models/actionres.model";
import * as _ from "lodash";
import { ErrorResponse } from "../../global/models/errorres.model";
import { Hl7Result } from "../../global/utils/hl7parser";
import { adt_inbound_queue } from "../queue/adt_inbound_queue";
// import { Hl7Persister } from "../../global/utils/hl7persister";
// import { test_queue } from "../queue";

const router = express.Router();

router.get("/entity", async (req, res, next) => {
	try {
		var result: ActionRes<string> = new ActionRes<string>({
			item: "",
		});
		res.status(200).send(result);
	} catch (error) {
		next(error);
	}
});

router.post("/", async (req, res, next) => {
	try {
		adt_inbound_queue.add({ value: req.body });
		// var hl7persister = new Hl7Persister();
		// var result = await hl7persister.Persist(req.body);
		res.status(200).send(true);
	} catch (error) {
		next(error);
	}
});

export { router as HL7HandlerController };
