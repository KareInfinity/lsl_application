import { Base } from "./base.model";
import * as _ from "lodash";
import { NotificationMessage } from "./notificationmessage.model";
class ErrorResponse<T> extends Base {
	success: boolean = false;
	message: string = "";
	item?: any;
	code: ErrorResponse.ErrorCodes = ErrorResponse.ErrorCodes.BAD_REQUEST;
	notification?: NotificationMessage;

	constructor(init?: Partial<ErrorResponse<T>>) {
		super(init);
		if (init) {
			this.success = _.get(init, "success", false);
			this.message = _.get(init, "message", "");
			if (init.code != null) this.code = init.code;
			if (_.get(init, "item", null) != null) {
				this.item = init.item;
			}
			if (_.get(init, "notification", null) != null) {
				this.notification = init.notification;
			}
		}
	}
}
module ErrorResponse {
	export enum ErrorCodes {
		BAD_REQUEST,
		DEVICE_NOT_FOUND,
		CABLE_NOT_FOUND,
		DEVICE_TYPE_INVALID,
		DRIVER_NOT_FOUND,
		DEVICE_ALREADY_ASSOCIATED,
		DEVICE_IS_NOT_ASSOCIATED
	}
}

export { ErrorResponse };
