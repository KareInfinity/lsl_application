import { Base } from "./base.model";
import * as _ from "lodash";
export class ItemRequest extends Base {
	id: string = "";
	type: Item.TYPES = Item.TYPES.IDH;
	level: number = 0;
	constructor(init?: Partial<ItemRequest>) {
		super(init);
		if (init) {
			if (typeof init.id == "string") {
				this.id = init.id;
			}
			if (typeof init.level == "number") {
				this.level = init.level;
			}
			if (typeof init.type == "string") {
				this.type = init.type;
			}
		}
	}
}

export namespace Item {
	export enum TYPES {
		IDH = "IDH",
		IV_WATCH = "IV Watch",
		DEXCOM = "Dexcom Driver",
	}
}

export class ItemResponse<T> extends Base {
	id: string = "";
	type: Item.TYPES = Item.TYPES.IDH;
	details?: T;
	constructor(init?: Partial<ItemResponse<T>>) {
		super(init);
		if (init) {
			if (typeof init.id == "string") {
				this.id = init.id;
			}
			if (typeof init.type == "string") {
				this.type = init.type;
			}
			if (_.has(init, "details")) {
				this.details = init.details;
			}
		}
	}
}
