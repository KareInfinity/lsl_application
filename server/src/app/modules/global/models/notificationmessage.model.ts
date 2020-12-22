import * as _ from "lodash";

export class NotificationMessage {
	msg_app_key: string = "";
	msg_profile_key: string = "";
	msg_profile_priority: string = "";
	msg_type: string = "";
	msg_text: string = "";
	msg_additional_data: string = "";
	activity_status: string = "SUCCESS";
	constructor(init?: Partial<NotificationMessage>) {
		if (init) {
			// if (typeof init.id == "number") this.id = init.id;
			if (typeof init.msg_app_key == "string")
				this.msg_app_key = init.msg_app_key;
			if (typeof init.msg_profile_key == "string")
				this.msg_profile_key = init.msg_profile_key;
			if (typeof init.msg_type == "string") this.msg_type = init.msg_type;
			if (typeof init.msg_text == "string") this.msg_text = init.msg_text;
			if (typeof init.msg_profile_priority == "string")
				this.msg_profile_priority = init.msg_profile_priority;
			if (typeof init.msg_additional_data == "string")
				this.msg_additional_data = init.msg_additional_data;
			if (typeof init.activity_status == "string")
				this.activity_status = init.activity_status;
		}
	}
}
