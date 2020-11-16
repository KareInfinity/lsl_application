import * as _ from "lodash";
export class Environment {
	BASE_URL?: string;
	PORT?: number;
	/* app mode */
	NODE_ENV?: string;
	/* modules */
	AUTH?: boolean;
	GATEWAY?: boolean;
	/* sql server credentials */
	SQL_SERVER_USER?: string;
	SQL_SERVER_PASSWORD?: string;
	SQL_SERVER?: string;
	SQL_SERVER_INSTANCE?: string;
	SQL_SERVER_DATABASE?: string;
	SQL_SERVER_PORT?: number;
	/* EC */
	EC_URL: string = "";
	EC_API_ENDPOINTS: any = {};
	/* ISAS */
	ISAS_UNIQUE_NAME: string = "";
	ISAS_URL: string = "";
	ISAS_API_ENDPOINTS: any = {};
	ISAS_APPLICATION_NAME = "";
	ISAS_APPLICATION_VERSION = "";
	ISAS_APPLLICATION_PRIVILEGE_LIST = [];
	ISAS_APPLICATION_ID = "";
	ISAS_APPLICATION_SECRET = "";
	ISAS_SECURITY_MODEL = "";
	/* Gateway windows service */
	GWS_URL: string = "";
	/* Notification Manager URL */
	NM_UNIQUE_NAME: string = "";
	NM_URL: string = "";
	NM_API_ENDPOINTS: any = {};
	NM_MESSAGE_PROFILE_LIST: Array<any> = [];
	NM_APP_KEY: string = "";
	NM_UI_ENDPOINTS: any = {};
	/* License Manager URL */
	LM_UNIQUE_NAME: string = "";
	LM_URL: string = "";
	LM_API_ENDPOINTS: any = {};
	LM_APP_KEY: string = "";
	LM_FROM_VER: string = "";
	LM_ENT_KEY: string = "";
	constructor() {
		var env = process.env;
		this.BASE_URL = _.get(env, "BASE_URL", "");
		this.GWS_URL = _.get(env, "GWS_URL", "");
		this.NM_UNIQUE_NAME = _.get(env, "NM_UNIQUE_NAME", "");
		this.NM_URL = _.get(env, "NM_URL", "");
		this.NM_APP_KEY = _.get(env, "NM_APP_KEY", "");
		this.NM_API_ENDPOINTS = JSON.parse(
			_.get(process.env, "NM_API_ENDPOINTS", "{}")
		);
		this.NM_MESSAGE_PROFILE_LIST = JSON.parse(
			_.get(env, "NM_MESSAGE_PROFILE_LIST", "[]")
		);
		this.NM_UI_ENDPOINTS = JSON.parse(_.get(env, "NM_UI_ENDPOINTS", "{}"));
		this.LM_UNIQUE_NAME = _.get(env, "LM_UNIQUE_NAME", "");
		this.LM_URL = _.get(env, "LM_URL", "");
		this.LM_API_ENDPOINTS = JSON.parse(
			_.get(process.env, "LM_API_ENDPOINTS", "{}")
		);
		this.LM_APP_KEY = _.get(env, "LM_APP_KEY", "");
		this.LM_FROM_VER = _.get(env, "LM_FROM_VER", "");
		this.LM_ENT_KEY = _.get(env, "LM_ENT_KEY", "");
		this.PORT = parseInt(_.get(env, "PORT", "3000").trim());
		this.SQL_SERVER_USER = _.get(process, "env.SQL_SERVER_USER", "").trim();
		this.SQL_SERVER_PASSWORD = _.get(
			process,
			"env.SQL_SERVER_PASSWORD",
			""
		).trim();
		this.SQL_SERVER = _.get(process, "env.SQL_SERVER", "").trim();
		this.SQL_SERVER_INSTANCE = _.get(
			process,
			"env.SQL_SERVER_INSTANCE",
			""
		).trim();
		this.SQL_SERVER_DATABASE = _.get(
			process,
			"env.SQL_SERVER_DATABASE",
			""
		).trim();
		this.SQL_SERVER_PORT = parseInt(
			_.get(process, "env.SQL_SERVER_PORT", "0").trim()
		);
		this.AUTH = _.get(process, "env.AUTH", "").trim() == "true";
		this.GATEWAY = _.get(process, "env.GATEWAY", "").trim() == "true";
		this.NODE_ENV = _.get(process, "env.NODE_ENV", "development").trim();
		this.EC_URL = _.get(process.env, "EC_URL", "");
		this.EC_API_ENDPOINTS = JSON.parse(
			_.get(process.env, "EC_API_ENDPOINTS", "{}")
		);
		this.ISAS_UNIQUE_NAME = _.get(process.env, "ISAS_UNIQUE_NAME", "");
		this.ISAS_URL = _.get(process.env, "ISAS_URL", "");
		this.ISAS_API_ENDPOINTS = JSON.parse(
			_.get(process.env, "ISAS_API_ENDPOINTS", "{}")
		);
		this.ISAS_APPLICATION_NAME = _.get(
			process.env,
			"ISAS_APPLICATION_NAME",
			""
		);
		this.ISAS_APPLICATION_VERSION = _.get(
			process.env,
			"ISAS_APPLICATION_VERSION",
			""
		);
		this.ISAS_APPLLICATION_PRIVILEGE_LIST = JSON.parse(
			_.get(process.env, "ISAS_APPLLICATION_PRIVILEGE_LIST", "[]")
		);
		this.ISAS_APPLICATION_ID = _.get(
			process.env,
			"ISAS_APPLICATION_ID",
			""
		);
		this.ISAS_APPLICATION_SECRET = _.get(
			process.env,
			"ISAS_APPLICATION_SECRET",
			""
		);
		this.ISAS_SECURITY_MODEL = _.get(
			process.env,
			"ISAS_SECURITY_MODEL",
			""
		);
	}
	static getInstance() {
		return new Environment();
	}
	set _ISAS_APPLICATION_ID(value: string) {
		process.env.ISAS_APPLICATION_ID = value;
		this.ISAS_APPLICATION_ID = value;
	}
	set _ISAS_APPLICATION_SECRET(value: string) {
		process.env.ISAS_APPLICATION_SECRET = value;
		this.ISAS_APPLICATION_SECRET = value;
	}
	set _ISAS_SECURITY_MODEL(value: string) {
		process.env.ISAS_SECURITY_MODEL = value;
		this.ISAS_SECURITY_MODEL = value;
	}
	set _NM_URL(value: string) {
		process.env.NM_URL = value;
		this.NM_URL = value;
	}
	set _LM_URL(value: string) {
		process.env.LM_URL = value;
		this.LM_URL = value;
	}
	set _ISAS_URL(value: string) {
		process.env.ISAS_URL = value;
		this.ISAS_URL = value;
	}
}
