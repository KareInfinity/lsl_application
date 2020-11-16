import * as _ from "lodash";
import { Base } from "./base.model";
import { DeviceModel } from "./device.model";

export class CableDriverMapModel extends Base {
	id: number = 0;
	cable_id: number = 0;
	cable_name: string = "";
	driver_id: number = 0;
	driver_name: string = "";
	precept_association_id: number = 0;
	is_suspended: boolean = false;
	parent_id: number = 0;
	notes: string = "";
	//
	device: DeviceModel = new DeviceModel();
	/* template */
	created_by: number = 0;
	modified_by: number = 0;
	created_on: Date | null = null;
	modified_on: Date | null = null;
	is_active: boolean = true;
	is_factory: boolean = false;

	constructor(init?: Partial<CableDriverMapModel>) {
		super(init);
		if (init) {
			if (typeof init.id == "number") this.id = init.id;
			if (typeof init.cable_id == "number") this.cable_id = init.cable_id;
			if (typeof init.cable_name == "string")
				this.cable_name = init.cable_name;
			if (typeof init.driver_id == "number")
				this.driver_id = init.driver_id;
			if (typeof init.driver_name == "string")
				this.driver_name = init.driver_name;
			if (typeof init.is_suspended == "boolean")
				this.is_suspended = init.is_suspended;
			if (typeof init.parent_id == "number")
				this.parent_id = init.parent_id;
			if (typeof init.notes == "string") this.notes = init.notes;
			/* template */
			if (typeof init.created_by == "number")
				this.created_by = init.created_by;
			if (typeof init.modified_by == "number")
				this.modified_by = init.modified_by;
			if (typeof init.is_active == "boolean")
				this.is_active = init.is_active;
			if (
				init.created_on instanceof Date ||
				typeof init.created_on == "string"
			)
				this.created_on = new Date(init.created_on);
			if (
				init.modified_on instanceof Date ||
				typeof init.modified_on == "string"
			)
				this.modified_on = new Date(init.modified_on);
			if (_.get(init, "device", null) != null)
				this.device = new DeviceModel(init.device);
		}
	}
}
export class CableDriverMapModelCriteria extends CableDriverMapModel {
	error: string = "";
	constructor(init?: Partial<CableDriverMapModelCriteria>) {
		super(init);
		if (init) {
			if (typeof init.error == "string") this.error = init.error;
		}
	}
}
