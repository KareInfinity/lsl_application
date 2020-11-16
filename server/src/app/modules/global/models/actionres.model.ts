import * as _ from "lodash";
import { Base } from "./base.model";
import { NotificationMessage } from "./notificationmessage.model";
class ActionRes<T> extends Base {
	total_count?: number;
	success: boolean = true;
	message?: string;
	item?: T;
	notification?: NotificationMessage;

	constructor(init?: Partial<ActionRes<T>>) {
		super(init);
		if (init) {
			if (typeof init.message == "string") this.message = init.message;
			if (_.get(init, "item", null) != null) {
				this.item = init.item;
			}
			if (_.get(init, "notification", null) != null) {
				this.notification = init.notification;
			}
			if (typeof init.total_count == "number") {
				this.total_count = init.total_count;
			}
		}
	}
}
// module ActionRes
// {
//     export enum statuses
//     {
// 		success="SUCCESS",
// 		failure="FAILURE"
//     }
// }

export { ActionRes };
