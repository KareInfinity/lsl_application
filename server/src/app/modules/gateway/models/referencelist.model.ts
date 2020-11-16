import { Base } from "../../global/models/base.model";
import * as _ from "lodash";
export class ReferenceListModel extends Base {
	id: number = 0;
	ref_type_code: string = "";
	ref_type_display_text: string = "";
	ref_value_code: string = "";
	ref_value_display_text: string = "";
	sorting_index: number = 0;
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

	constructor(init?: Partial<ReferenceListModel>) {
		super(init);
		if (init) {
			if (_.get(init, "id", null) != null) {
				this.id = parseInt((init.id as number).toString());
			}
			this.ref_type_code = _.get(init, "ref_type_code", "");
			this.ref_type_display_text = _.get(
				init,
				"ref_type_display_text",
				""
			);
			this.ref_value_code = _.get(init, "ref_value_code", "");
			this.ref_value_display_text = _.get(
				init,
				"ref_value_display_text",
				""
			);
			/* 			_.mapKeys(this, (v, k) => {
				if (_.get(init, k, null) != null) {
					_.set(this, k, _.get(init, k, null));
				}
			}); */

			//
			if (_.get(init, "created_by", null) != null) {
				this.created_by = parseInt(
					(init.created_by as number).toString()
				);
			}
			if (_.get(init, "created_on", null) != null) {
				if (typeof init?.created_on == "string") {
					this.created_on = new Date(init.created_on);
				} else {
					this.created_on = init?.created_on!;
				}
			} else {
				this.created_on = new Date();
			}
			if (_.get(init, "modified_by", null) != null) {
				this.modified_by = parseInt(
					(init.modified_by as number).toString()
				);
			}
			if (_.get(init, "modified_on", null) != null) {
				if (typeof init?.modified_on == "string") {
					this.modified_on = new Date(init.modified_on);
				} else {
					this.modified_on = init?.modified_on!;
				}
			} else {
				this.modified_on = new Date();
			}
			if (_.get(init, "version", null) != null) {
				this.version = parseInt((init.version as number).toString());
			}
			this.is_active = _.get(init, "is_active", false);
			this.is_suspended = _.get(init, "is_suspended", false);
			this.notes = _.get(init, "notes", "");
		}
	}
}

class Locality extends Base {
	refvalue_name: string = "";

	constructor(init?: Partial<Locality>) {
		super(init);
		if (init) {
			_.mapKeys(this, (v, k) => {
				if (_.get(init, k, null) != null) {
					_.set(this, k, _.get(init, k, null));
				}
			});
		}
	}
}
