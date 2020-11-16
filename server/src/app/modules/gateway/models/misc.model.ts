import * as _ from "lodash";
import { Base } from "./base.model";

export class PluginInfoMiscModel extends Base {
	name: string = "";
	base_url: string = "";
	server_port: number = 0;
	ui_port: number = 0;
	ui_urls: any = {};
	api_endpoints: any = {};
	constructor(init?: Partial<PluginInfoMiscModel>) {
		super(init);
		if (init) {
			if (typeof init.name == "string") {
				this.name = init.name;
			}
			if (typeof init.base_url == "string") {
				this.base_url = init.base_url;
			}
			if (typeof init.server_port == "number") {
				this.server_port = init.server_port;
			}
			if (typeof init.ui_port == "number") {
				this.ui_port = init.ui_port;
			}
			if (init.ui_urls != null) {
				this.ui_urls = init.ui_urls;
			}
			if (init.api_endpoints != null) {
				this.api_endpoints = init.api_endpoints;
			}
		}
	}
}
export class FeatureMiscModel {
	feature_name: string = "";
	feature_key: string = "";
	constructor(init?: Partial<FeatureMiscModel>) {
		if (init) {
			if (typeof init.feature_key == "string") {
				this.feature_key = init.feature_key;
			}
			if (typeof init.feature_name == "string") {
				this.feature_name = init.feature_name;
			}
		}
	}
}
