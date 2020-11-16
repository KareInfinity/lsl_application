import * as _ from "lodash";
import { Base } from "./base.model";

export class DeviceValues extends Base {
	id: number = 0;
	idh_session_id: number = 0;
	device_id: number = 0;
	device_name: string = "";
	device_type: string = "";
	raw_value: number = 0;
	raw_value_uom: string = "";
	/* template */
	created_by: number = 0;
	modified_by: number = 0;
	created_on: Date | null = null;
	modified_on: Date | null = null;
	is_active: boolean = true;
	is_factory: boolean = false;

	constructor(init?: Partial<DeviceValues>) {
		super(init);
		if (init) {
			if (typeof init.id == "number") this.id = init.id;
			if (typeof init.idh_session_id == "number")
				this.idh_session_id = init.idh_session_id;
			if (typeof init.device_id == "number")
				this.device_id = init.device_id;
			if (typeof init.device_name == "string")
				this.device_name = init.device_name;
			if (typeof init.device_type == "string")
				this.device_type = init.device_type;
			if (typeof init.raw_value == "number")
				this.raw_value = init.raw_value;
			if (typeof init.raw_value_uom == "string")
				this.raw_value_uom = init.raw_value_uom;
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
		}
	}
}

export class CustomDeviceValues extends Base {
	id: number = 0;
	idh_session_id: number = 0;
	device_id: number = 0;
	message_direction: string = "";
	hl7_version: string = "";
	device_event: string = "";
	raw_value: number = 0;
	raw_value_uom: string = "";
	created_on: Date | null = null;
	from_date: Date | null = null;
	to_date: Date | null = null;
	constructor(init?: Partial<CustomDeviceValues>) {
		super(init);
		if (init) {
			if (typeof init.id == "number") this.id = init.id;
			if (typeof init.idh_session_id == "number")
				this.idh_session_id = init.idh_session_id;
			if (typeof init.device_id == "number")
				this.device_id = init.device_id;
			if (typeof init.message_direction == "string")
				this.message_direction = init.message_direction;
			if (typeof init.hl7_version == "string")
				this.hl7_version = init.hl7_version;
			if (typeof init.device_event == "string")
				this.device_event = init.device_event;
			if (typeof init.raw_value == "number")
				this.raw_value = init.raw_value;
			if (typeof init.raw_value_uom == "string")
				this.raw_value_uom = init.raw_value_uom;
			if (
				init.created_on instanceof Date ||
				typeof init.created_on == "string"
			)
				this.created_on = new Date(init.created_on);
			if (
				init.from_date instanceof Date ||
				typeof init.from_date == "string"
			)
				this.from_date = new Date(init.from_date);
			if (init.to_date instanceof Date || typeof init.to_date == "string")
				this.to_date = new Date(init.to_date);
		}
	}
}
