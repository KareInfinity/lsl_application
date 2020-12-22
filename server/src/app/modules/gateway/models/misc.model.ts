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
export class ECHierarchyNode {
	IsActive: boolean = false;
	NodeID: number = 0;
	NodeInfo: any = null;
	NodeName: string = "";
	NodeShortName: string = "";
	NodeType: string = "";
	IconUrl: string = "";
	ParentID: number = 0;
	PluginID: any = null;
	PluginInfoId: any = null;
	TypeOf: string = "";
	Uid: string = "";
	createdAt: Date = new Date();
	updatedAt: Date = new Date();
	constructor(init?: Partial<ECHierarchyNode>) {
		if (init) {
			if (typeof init.IsActive == "boolean") {
				this.IsActive = init.IsActive;
			}
			if (typeof init.NodeID == "number") {
				this.NodeID = init.NodeID;
			}
			if (init.NodeInfo) {
				this.NodeInfo = init.NodeInfo;
			}
			if (typeof init.NodeName == "string") {
				this.NodeName = init.NodeName;
			}
			if (typeof init.NodeShortName == "string") {
				this.NodeShortName = init.NodeShortName;
			}
			if (typeof init.NodeType == "string") {
				this.NodeType = init.NodeType;
			}
			if (typeof init.IconUrl == "string") {
				this.IconUrl = init.IconUrl;
			}
			if (typeof init.ParentID == "number") {
				this.ParentID = init.ParentID;
			}
			if (init.PluginID) {
				this.PluginID = init.PluginID;
			}
			if (init.PluginInfoId) {
				this.PluginInfoId = init.PluginInfoId;
			}
			if (typeof init.TypeOf == "string") {
				this.TypeOf = init.TypeOf;
			}
			if (typeof init.Uid == "string") {
				this.Uid = init.Uid;
			}
			if (
				typeof init.createdAt == "string" ||
				init.createdAt instanceof Date
			) {
				this.createdAt = new Date(init.createdAt);
			}
			if (
				typeof init.updatedAt == "string" ||
				init.updatedAt instanceof Date
			) {
				this.updatedAt = new Date(init.updatedAt);
			}
		}
	}
}

export class ISASHierarchyNode {
	Id: number = 0;
	Name: string = "";
	ParentId: number | null = null;
	Uid: string = "";
	MappedPrivileges: Array<ISASPrivilege> = [];
	constructor(init?: Partial<ISASHierarchyNode>) {
		if (init) {
			if (typeof init.Id == "number") {
				this.Id = init.Id;
			}
			if (typeof init.Name == "string") {
				this.Name = init.Name;
			}
			if (init.ParentId) {
				this.ParentId = init.ParentId;
			}
			if (typeof init.Uid == "string") {
				this.Uid = init.Uid;
			}
			if (init.MappedPrivileges) {
				_.forEach(init.MappedPrivileges, (v) => {
					this.MappedPrivileges.push(new ISASPrivilege(v));
				});
			}
		}
	}
}
export class ISASPrivilege {
	Key: string = "";
	Name: string = "";
	constructor(init?: Partial<ISASPrivilege>) {
		if (init) {
			if (typeof init.Key == "string") {
				this.Key = init.Key;
			}
			if (typeof init.Name == "string") {
				this.Name = init.Name;
			}
		}
	}
}
