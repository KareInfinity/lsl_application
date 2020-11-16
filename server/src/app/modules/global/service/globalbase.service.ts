import * as utils from "../utils";
import { DB, Environment } from "../utils";
/* types */
import { Logger } from "log4js";

class GlobalBaseService {
	/* Database */
	db: DB = new DB();

	/* utils */
	utils = utils;

	/* environment */
	environment: Environment;

	constructor() {
		this.environment = new Environment();
	}

	/**
	 * log
	 */

	public logGlobal(
		logger: Logger,
		level: GlobalBaseService.LogLevels,
		data: any
	) {
		var TAG = "[SERVICE]\t";
		var stringfied_data: String = JSON.stringify(data);
		var log_data: string = TAG + stringfied_data;
		switch (level) {
			case GlobalBaseService.LogLevels.error:
				logger.error(log_data);
				break;
			case GlobalBaseService.LogLevels.info:
				logger.info(log_data);
				break;
			default:
				break;
		}
	}

	public async asyncForEach(array: Array<any>, callback: any) {
		for (let index = 0; index < array.length; index++) {
			await callback(array[index], index, array);
		}
	}
}
module GlobalBaseService {
	export enum LogLevels {
		error,
		info,
	}
}
export { GlobalBaseService };
