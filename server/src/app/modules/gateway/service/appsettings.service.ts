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
	sql_save_settings: string = `
	UPDATE [dbo].[tblAppSettings]
   	SET [type] = @type
		,[value] = @value
		,[created_by] = @created_by
		,[modified_by] = @modified_by
		,[created_on] = @created_on
		,[modified_on] = @modified_on
	OUTPUT INSERTED.*
	WHERE id = @id;
	`;
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
						var temp = result_temp.recordset[0];
						result = new AppSettingsModel(temp);
						result.id = parseInt(temp.id);
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
	async saveSettings(_req : AppSettingsModel): Promise<AppSettingsModel> {
		let result: AppSettingsModel = new AppSettingsModel();
		try {
			await using(this.db.getDisposablePool(), async (pool) => {
				const client: ConnectionPool = await pool.connect();
				try {
					var result_temp: IResult<any> = await pool
						.getRequest(client)
						.input("id", this.db.TYPES.BigInt, _req.id)
						.input("type", this.db.TYPES.VarChar, _req.type)
						.input("value", this.db.TYPES.NVarChar, JSON.stringify(_req.value))
						.input("created_by", this.db.TYPES.BigInt, _req.created_by)
						.input("modified_by", this.db.TYPES.BigInt, _req.modified_by)
						.input("created_on", this.db.TYPES.DateTime, _req.created_on)
						.input("modified_on", this.db.TYPES.DateTime, _req.modified_on)
						.query(this.sql_save_settings);
					
					if (_.get(result_temp, "recordset", null) != null) {
						var temp = result_temp.recordset[0];
						result = new AppSettingsModel(temp);
						result.id = parseInt(temp.id);
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
