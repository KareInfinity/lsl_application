import express from "express";
import { ActionRes } from "../../global/models/actionres.model";
import { ReferenceListService } from "../service/referencelist.service";
import { ReferenceListModel } from "../models/referencelist.model";
import * as _ from "lodash";
const router = express.Router();
router.get("/entity", async (req, res, next) => {
	try {
		var result: ActionRes<ReferenceListModel> = new ActionRes<ReferenceListModel>({
			item: new ReferenceListModel()
		});
		res.status(200).send(result);
	} catch (error) {
		next(error);
	}
});

router.get("/daterangefilter", async (req, res, next) => {
	try {
		var reference_list_service: ReferenceListService = new ReferenceListService();
		// var id = _.get(req, "params.id", 0);
		var date_range_list: Array<ReferenceListModel> = await reference_list_service.getDateRangeReferenceList("DATE_RANGE_FILTER");
		var result: ActionRes<Array<ReferenceListModel>> = new ActionRes<Array<ReferenceListModel>>({
			item: date_range_list
		});
		res.status(200).send(result);
	} catch (error) {
		next(error);
	}
});

export { router as ReferenceListController };
