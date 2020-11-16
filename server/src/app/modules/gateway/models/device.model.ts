import * as _ from "lodash";
import { Base } from "./base.model";

export class DeviceModel extends Base {
	id: number = 0;
	device_name: string = "";
	device_type: string = "";
	driver_name: string = "";
	last_seen: Date | null = null;
	battery_capacity: string = "";
	network_signal: number = 0;
	hardware_version: string = "";
	software_version: string = "";
	communication_mode: string = "";
	ip_address: string = "";
	mac_address: string = "";
	serial_no: string = "";
	is_disposable: boolean = false;
	barcode: string = "";
	facility: string = "";
	tags: string = "";
	physical_location: string = "";
	attributes?: any;
	is_commissioned: boolean = false;
	/* template */
	created_by: number = 0;
	modified_by: number = 0;
	created_on: Date | null = null;
	modified_on: Date | null = null;
	is_active: boolean = true;
	is_suspended: boolean = false;
	parent_id: number = 0;
	is_factory: boolean = false;
	notes: string = "";
	/* extensions */
	idh_session_id: number = 0;

	constructor(init?: Partial<DeviceModel>) {
		super(init);
		if (init) {
			if (typeof init.id == "number") this.id = init.id;
			if (typeof init.device_name == "string")
				this.device_name = init.device_name;
			if (typeof init.device_type == "string")
				this.device_type = init.device_type;
			if (typeof init.driver_name == "string")
				this.driver_name = init.driver_name;
			if (
				init.last_seen instanceof Date ||
				typeof init.last_seen == "string"
			)
				this.last_seen = new Date(init.last_seen);
			if (typeof init.battery_capacity == "string")
				this.battery_capacity = init.battery_capacity;
			if (typeof init.network_signal == "number")
				this.network_signal = init.network_signal;

			if (typeof init.hardware_version == "string")
				this.hardware_version = init.hardware_version;
			if (typeof init.software_version == "string")
				this.software_version = init.software_version;
			if (typeof init.communication_mode == "string")
				this.communication_mode = init.communication_mode;
			if (typeof init.ip_address == "string")
				this.ip_address = init.ip_address;
			if (typeof init.mac_address == "string")
				this.mac_address = init.mac_address;
			if (typeof init.serial_no == "string")
				this.serial_no = init.serial_no;
			if (typeof init.is_disposable == "boolean")
				this.is_disposable = init.is_disposable;
			if (typeof init.barcode == "string") this.barcode = init.barcode;
			if (typeof init.facility == "string") this.facility = init.facility;
			if (typeof init.tags == "string") this.tags = init.tags;
			if (typeof init.physical_location == "string")
				this.physical_location = init.physical_location;
			if (_.get(init, "attributes", null) != null) {
				if (typeof init.attributes == "string") {
					try {
						this.attributes = JSON.parse(init.attributes);
					} catch (error) {
						this.attributes = {};
					}
				} else {
					this.attributes = init.attributes;
				}
			}
			if (typeof init.is_commissioned == "boolean")
				this.is_commissioned = init.is_commissioned;

			//
			if (typeof init.created_by == "number")
				this.created_by = init.created_by;
			if (typeof init.modified_by == "number")
				this.modified_by = init.modified_by;
			if (typeof init.is_active == "boolean")
				this.is_active = init.is_active;
			if (typeof init.is_suspended == "boolean")
				this.is_suspended = init.is_suspended;
			if (typeof init.is_factory == "boolean")
				this.is_factory = init.is_factory;
			if (typeof init.notes == "string") this.notes = init.notes;

			if (typeof init.parent_id == "number")
				this.parent_id = init.parent_id;
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
			/* extensions */
			if (typeof init.idh_session_id == "number")
				this.idh_session_id = init.idh_session_id;
		}
	}
}

export namespace DeviceModel {
	export enum DeviceTypes {
		iv_watch = "IV Watch",
		dexcom = "DexcomG6",
		idh = "IDH",
	}
}

export class DeviceModelCriteria extends DeviceModel {
	from_date: Date | null = null;
	to_date: Date | null = null;
	error: string = "";
	constructor(init?: Partial<DeviceModelCriteria>) {
		super(init);
		if (init) {
			if (
				init.from_date instanceof Date ||
				typeof init.from_date == "string"
			)
				this.from_date = new Date(init.from_date);
			if (init.to_date instanceof Date || typeof init.to_date == "string")
				this.to_date = new Date(init.to_date);
			if (typeof init.error == "string") this.error = init.error;
		}
	}
}
