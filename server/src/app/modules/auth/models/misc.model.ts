export class ECResponse<T> {
	responseCode: number = 0;
	statusCode: number = 0;
	data?: T;
	constructor(init?: Partial<ECResponse<T>>) {
		if (init) {
			if (typeof init.responseCode == "number")
				this.responseCode = init.responseCode;
			if (typeof init.statusCode == "number")
				this.statusCode = init.statusCode;
			if (init.data != null) this.data = init.data;
		}
	}
}
export class ISASRegistrationViaEC {
	ErrorCode: number = 0;
	ErrorText: string = "";
	Application_Id: string = "";
	Application_Secret: string = "";
	Application_GUID: string = "";
	IsNewApplication: boolean = false;
	constructor(init?: Partial<ISASRegistrationViaEC>) {
		if (init) {
			if (typeof init.ErrorCode == "number")
				this.ErrorCode = init.ErrorCode;
			if (typeof init.ErrorText == "string")
				this.ErrorText = init.ErrorText;
			if (typeof init.Application_Id == "string")
				this.Application_Id = init.Application_Id;
			if (typeof init.Application_Secret == "string")
				this.Application_Secret = init.Application_Secret;
			if (typeof init.Application_GUID == "string")
				this.Application_GUID = init.Application_GUID;
			if (typeof init.IsNewApplication == "boolean")
				this.IsNewApplication = init.IsNewApplication;
		}
	}
}
export class GetPluginInfoViaEC {
	name: string = "";
	baseUrl: string = "";
	serverPort: number = 0;
	uiport: number = 0;
	serverUrls: any = {};
	constructor(init?: Partial<GetPluginInfoViaEC>) {
		if (init) {
			if (typeof init.name == "string") this.name = init.name;
			if (typeof init.baseUrl == "string") this.baseUrl = init.baseUrl;
			if (typeof init.serverPort == "number")
				this.serverPort = init.serverPort;
			if (typeof init.uiport == "number") this.uiport = init.uiport;
			if (init.serverUrls != null) this.serverUrls = init.serverUrls;
		}
	}
}
export class ISASIntrospectUser {
	accesstoken: string = "";
	siteid?: number;
	constructor(init?: Partial<ISASIntrospectUser>) {
		if (init) {
			if (typeof init.accesstoken == "string")
				this.accesstoken = init.accesstoken;
			if (typeof init.siteid == "number") this.siteid = init.siteid;
		}
	}
}
export class ISASUser {
	Username: string = "";
	constructor(init?: Partial<ISASUser>) {
		if (init) {
			if (typeof init.Username == "string") this.Username = init.Username;
		}
	}
}
