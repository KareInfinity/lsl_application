
import * as _ from "lodash";
import { Base } from "./base.model";
class ActionRes<T> extends Base {
	success: boolean = true;
	message?: string;
	item?: T;
	constructor(init?: Partial<ActionRes<T>>) {
		super(init);
		if (init) {
			if (typeof init.message == "string") this.message = init.message;
			if (_.get(init, "item", null) != null) {
				this.item = init.item;
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
