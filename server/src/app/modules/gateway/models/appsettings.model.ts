import * as _ from "lodash";
import { Base } from "./base.model";

export class AppSettingsModel extends Base {
	id: number = 0;
	type: string = "";
	value?: any;
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

	constructor(init?: Partial<AppSettingsModel>) {
		super(init);
		if (init) {
			if (typeof init.id == "number") this.id = init.id;
			if (typeof init.type == "string") this.type = init.type;
			if (_.get(init, "value", null) != null) {
				if (typeof init.value == "string") {
					try {
						this.value = JSON.parse(init.value);
					} catch (error) {
						this.value = [];
					}
				} else {
					this.value = init.value;
				}
			}
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
		}
	}
}
export namespace AppSettingsModel {
	export enum types {
		LSL_PAGES = "LSL_PAGES",
	}
}
