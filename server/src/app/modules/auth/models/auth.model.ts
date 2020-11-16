import * as _ from "lodash";
import { User } from "./user.model";
import { Base } from "./base.model";
class Auth extends Base {
	type: Auth.auth_types | null = null;
	method: Auth.auth_methods | null = null;
	param_1: string = "";
	param_2: string = "";
	access_token: string = "";
	access_token_expiry_time: Date = new Date();
	refresh_token: string = "";
	user: User = new User();
	constructor(init?: Partial<Auth>) {
		super(init);
		if (init) {
			if (typeof init?.type == "string") this.type = init.type;
			if (typeof init?.method == "string") this.method = init.method;
			if (typeof init?.param_1 == "string") this.param_1 = init.param_1;
			if (typeof init?.param_2 == "string") this.param_2 = init.param_2;
			if (typeof init?.access_token == "string")
				this.access_token = init.access_token;
			if (typeof init?.refresh_token == "string")
				this.refresh_token = init.refresh_token;
			if (init.user) this.user = init.user;
			if (init.access_token_expiry_time instanceof Date)
				this.access_token_expiry_time = init.access_token_expiry_time;
		}
	}
}

module Auth {
	export enum auth_types {
		ISAS = "ISAS",
		LDAP = "LDAP",
		IMPRIVATA = "Imprivata",
	}
	export enum auth_methods {
		PASSWORD = "Password",
		PROXIMITY_CARD = "Proximity Card",
	}
}

export { Auth };
