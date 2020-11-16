import * as _ from "lodash";
import { Base } from "../../global/models/base.model";
export default class AppMsgProfile extends Base {
	id: number = 0;
	app_key: string = "";
	app_name: string = "";
	msg_profile_key: string = "";
	msg_profile_display_text: string = "";
	msg_profile_priority: string = "";
	msg_profile_priority_code: number = 0;
	msg_profile_assignment_status: boolean = false;
	last_run: Date = new Date();

	created_by: number = 0;
	modified_by: number = 0;
	created_on: Date = new Date();
	modified_on: Date = new Date();
	is_active: boolean = true;
	version: number = 1;
	lang_code: string = "en-GB";
	is_suspended: boolean = false;
	parent_id: number = 0;
	is_factory: boolean = false;
	notes: string = "";
	message_log_count: number = 0;

	constructor(init?: Partial<AppMsgProfile>) {
		super(init);
	}
}

export class AppMsgProfileCriteria extends AppMsgProfile {
	error: string = "";
	constructor(init?: AppMsgProfileCriteria) {
		super(init);
		if (init) {
			if (typeof init.error == "string") {
				this.error = init.error;
			}
		}
	}
}
