import * as _ from "lodash";
class PluginParameter<T> {
	source_application: string;
	to_application: string;
	method: string;
	mode: string;
	value?: T;
	constructor(init?: Partial<PluginParameter<T>>) {
		this.source_application = _.get(init, "source_application", "");
		this.to_application = _.get(init, "to_application", "");
		this.method = _.get(init, "method", "");
		this.mode = _.get(init, "mode", "");
		if (init?.value) this.value = init?.value;
	}
}

export default PluginParameter;
