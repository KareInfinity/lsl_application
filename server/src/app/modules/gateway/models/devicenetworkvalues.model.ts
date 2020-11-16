
import * as _ from "lodash";
import { Base } from "./base.model";

export class DeviceNetworkValues extends Base {
	id: number = 0;
	idh_session_id: number = 0;
	device_id: number = 0;
	network_info: string = "";
	/* template */
	created_by: number = 0;
	modified_by: number = 0;
	created_on: Date | null = null;
	modified_on: Date | null = null;
	is_active: boolean = true;
	is_factory: boolean = false;

	constructor(init?: Partial<DeviceNetworkValues>) {
		super(init);
		if (typeof init?.id == "number") this.id = init.id;
		if (typeof init?.idh_session_id == "number") this.idh_session_id = init.idh_session_id;
		if (typeof init?.device_id == "number") this.device_id = init.device_id;
		if (typeof init?.network_info == "string") this.network_info = init.network_info;
		//
		if (typeof init?.created_by == "number")
			this.created_by = init.created_by;
		if (typeof init?.modified_by == "number")
			this.modified_by = init.modified_by;
		if (typeof init?.is_active == "boolean")
			this.is_active = init.is_active;
		if (
			init?.created_on instanceof Date ||
			typeof init?.created_on == "string"
		)
			this.created_on = new Date(init.created_on);
		if (
			init?.modified_on instanceof Date ||
			typeof init?.modified_on == "string"
		)
			this.modified_on = new Date(init.modified_on);
	}
}


