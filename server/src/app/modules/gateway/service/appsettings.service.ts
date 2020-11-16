import { using, Environment } from "../../global/utils";
import { BaseService } from "./base.service";
import * as _ from "lodash";
import { IResult, ConnectionPool, Transaction } from "mssql";
import { CableModel } from "../models/cable.model";
import axios from "axios";
import { ErrorResponse } from "../../global/models/errorres.model";
import { AppSettingsModel } from "../models/appsettings.model";

export class AppSettingsService extends BaseService {
	sql_get_settings: string = `SELECT * FROM tblAppSettings`;

	async getSettings(type: string): Promise<AppSettingsModel> {
		let result: AppSettingsModel = new AppSettingsModel();
		try {
			await using(this.db.getDisposablePool(), async (pool) => {
				const client: ConnectionPool = await pool.connect();
				try {
					var qb = new this.utils.QueryBuilder(this.sql_get_settings);
					if (type != null && type.length > 0)
						qb.addParameter("type", type, "=");
					var query_string = qb.getQuery();
					var result_temp: IResult<any> = await client.query(
						query_string
					);
					if (_.get(result_temp, "recordset", null) != null) {
						result = new AppSettingsModel(result_temp.recordset[0]);
					}
				} catch (error) {
					throw error;
				}
			});
		} catch (error) {
			throw error;
		}
		return result;
	}
}
