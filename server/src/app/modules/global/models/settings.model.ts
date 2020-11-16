import * as _ from "lodash";
import { Base } from "./base.model";
class Settings extends Base {
	auth?: boolean;
	constructor(init?: Partial<Settings>) {
		super(init);
		if (typeof init?.auth == "boolean") this.auth = init.auth;
	}
}

export { Settings };
