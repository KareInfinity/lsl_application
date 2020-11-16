import * as _ from "lodash";
import { User } from "./user.model";
import { Base } from "./base.model";

export class UserSession extends Base {
	id: number = 0;
	refresh_token: string = "";
	isas_refresh_token: string = "";
	isas_access_token: string = "";
	lsl_access_token: string = "";
	user_id: string = "";
	start_time: Date | null = null;
	end_time: Date | null = null;
	last_active: Date | null = null;
	is_expired: boolean = false;
	killed_by: string = "";
	user_info: User = new User();
	/* template */
	created_by: string = "";
	modified_by: string = "";
	created_on: Date | null = null;
	modified_on: Date | null = null;
	is_active: boolean = true;

	constructor(init?: Partial<UserSession>) {
		super(init);
		if (init) {
			if (typeof init.id == "number") this.id = init.id;
			if (typeof init.killed_by == "string")
				this.killed_by = init.killed_by;
			if (typeof init.refresh_token == "string")
				this.refresh_token = init.refresh_token;
			if (typeof init.isas_refresh_token == "string")
				this.isas_refresh_token = init.isas_refresh_token;
			if (typeof init.isas_access_token == "string")
				this.isas_access_token = init.isas_access_token;
			if (typeof init.lsl_access_token == "string")
				this.lsl_access_token = init.lsl_access_token;
			if (typeof init.user_id == "string") this.user_id = init.user_id;
			if (
				init.start_time instanceof Date ||
				typeof init.start_time == "string"
			)
				this.start_time = new Date(init.start_time);
			if (
				init.end_time instanceof Date ||
				typeof init.end_time == "string"
			)
				this.end_time = new Date(init.end_time);
			if (
				init.last_active instanceof Date ||
				typeof init.last_active == "string"
			)
				this.last_active = new Date(init.last_active);
			if (typeof init.is_expired == "boolean")
				this.is_expired = init.is_expired;
			if (typeof init.created_by == "string")
				this.created_by = init.created_by;
			if (typeof init.modified_by == "string")
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
			if (init.user_info) this.user_info = new User(init.user_info);
		}
	}
}
