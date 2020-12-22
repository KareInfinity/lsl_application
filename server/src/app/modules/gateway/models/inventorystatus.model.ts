import * as _ from "lodash";
import { Base } from "./base.model";

export class InventoryStatusModel extends Base {
	id: number = 0;
	inventory_status_key: string = "";
	inventory_status_text: string = "";
	/* template */
	created_by: number = 0;
	modified_by: number = 0;
	created_on: Date = new Date();
	modified_on: Date = new Date();
	is_active: boolean = true;
	is_factory: boolean = false;
	is_suspended: boolean = false;
	parent_id: number = 0;
	notes: string = "";
	/* extensions */
	// idh_session_id: number = 0;

	constructor(init?: Partial<InventoryStatusModel>) {
		super(init);
		if (init) {
			if (typeof init.id == "number") this.id = init.id;
			if (typeof init.inventory_status_key == "string")
				this.inventory_status_key = init.inventory_status_key;
			if (typeof init.inventory_status_text == "string")
				this.inventory_status_text = init.inventory_status_text;
			//
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
			if (typeof init.is_factory == "boolean")
				this.is_factory = init.is_factory;
			if (typeof init.is_suspended == "boolean")
				this.is_suspended = init.is_suspended;
			if (typeof init.parent_id == "number")
				this.parent_id = init.parent_id;
			if (typeof init.notes == "string") this.notes = init.notes;
		}
		/* extensions */
		// if (typeof init?.idh_session_id == "number")
		// 	this.idh_session_id = init.idh_session_id;
	}
}
export namespace InventoryStatusModel {
	export enum FactoryStatuses {
		unconnected_disposable = "UNCONNECTED_DISPOSABLE",
		active = "ACTIVE",
	}
}
export class DeviceInventoryStatusModel extends Base {
	id: number = 0;
	device_id: number = -1;
	inventory_status_id: number = -1;
	inventory_status: string = "";
	/* template */
	created_by: number = 0;
	modified_by: number = 0;
	created_on: Date = new Date();
	modified_on: Date = new Date();
	is_active: boolean = true;
	is_factory: boolean = false;
	is_suspended: boolean = false;
	parent_id: number = 0;
	notes: string = "";
	/* extensions */
	// idh_session_id: number = 0;

	constructor(init?: Partial<DeviceInventoryStatusModel>) {
		super(init);
		if (init) {
			if (typeof init.id == "number") this.id = init.id;
			if (typeof init.device_id == "number")
				this.device_id = init.device_id;
			if (typeof init.inventory_status_id == "number")
				this.inventory_status_id = init.inventory_status_id;
			if (typeof init.inventory_status == "string")
				this.inventory_status = init.inventory_status;
			//
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
			if (typeof init.is_factory == "boolean")
				this.is_factory = init.is_factory;
			if (typeof init.is_suspended == "boolean")
				this.is_suspended = init.is_suspended;
			if (typeof init.parent_id == "number")
				this.parent_id = init.parent_id;
			if (typeof init.notes == "string") this.notes = init.notes;
		}
		/* extensions */
		// if (typeof init?.idh_session_id == "number")
		// 	this.idh_session_id = init.idh_session_id;
	}
}
export class DeviceInventoryStatusModelCriteria extends DeviceInventoryStatusModel {
	from_date: Date | null = null;
	to_date: Date | null = null;

	constructor(init?: Partial<DeviceInventoryStatusModelCriteria>) {
		super(init);
		if (init) {
			if (
				typeof init.from_date == "string" ||
				init.from_date instanceof Date
			) {
				this.from_date = new Date(init.from_date);
			}
			if (
				typeof init.to_date == "string" ||
				init.to_date instanceof Date
			) {
				this.to_date = new Date(init.to_date);
			}
		}
	}
}
