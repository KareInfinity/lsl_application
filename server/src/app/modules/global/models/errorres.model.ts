import { Base } from "./base.model";
import * as _ from "lodash";
import { NotificationMessage } from "./notificationmessage.model";
class ErrorResponse<T> extends Base {
	success: boolean = false;
	message: string = "";
	item?: any;
	code: ErrorResponse.ErrorCodes = ErrorResponse.ErrorCodes.BAD_REQUEST;
	notification?: NotificationMessage;
	source: any = null;
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
			if (init.source != null) {
				this.source = init.source;
			}
		}
	}
}
module ErrorResponse {
	export enum ErrorCodes {
		BAD_REQUEST = 1000,
		DEVICE_NOT_FOUND = 1001,
		CABLE_NOT_FOUND = 1002,
		DEVICE_TYPE_INVALID = 1003,
		DRIVER_NOT_FOUND = 1004,
		DEVICE_ALREADY_ASSOCIATED = 1005,
		DEVICE_IS_NOT_ASSOCIATED = 1006,
		INVENTORY_STATUS_REVIVED = 1007,
		INVENTORY_STATUS_ALREADY_EXISTS = 1008,
		ERROR_ON_PRECEPT_SERVICE = 1009
	}
}

export { ErrorResponse };
