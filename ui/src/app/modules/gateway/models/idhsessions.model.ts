import * as _ from "lodash";
import { Base } from "./base.model";

export class IDHSessionsModel extends Base {
	id: number = 0;
	device_id: number = 0;
	session_start: Date | null = null;
	session_end: Date | null = null;
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
	//
	session_guid: string = "";

	constructor(init?: Partial<IDHSessionsModel>) {
		super(init);
		if (init) {
			if (typeof init.id == "number") this.id = init.id;
			if (typeof init.device_id == "number") this.device_id = init.device_id;
			if (
				init.session_start instanceof Date ||
				typeof init.session_start == "string"
			)
				this.session_start = new Date(init.session_start);
			if (
				init.session_end instanceof Date ||
				typeof init.session_end == "string"
			)
				this.session_end = new Date(init.session_end);
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

export class IDHSessionsModelCriteria extends IDHSessionsModel {
  from_date: Date | null = null;
  to_date: Date | null = null;
  constructor(init?: Partial<IDHSessionsModelCriteria>) {
    super(init);
    if (init) {
      if (init.from_date instanceof Date || typeof init.from_date == "string")
        this.from_date = new Date(init.from_date);
      if (init.to_date instanceof Date || typeof init.to_date == "string")
        this.to_date = new Date(init.to_date);
    }
  }
}
