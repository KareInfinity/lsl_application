import { using, Environment } from "../../global/utils";
import { BaseService } from "./base.service";
import * as _ from "lodash";
import { IResult, ConnectionPool, Transaction } from "mssql";
import { CableModel } from "../models/cable.model";
import axios from "axios";
import { ErrorResponse } from "../../global/models/errorres.model";
import {
	CableDriverMapModel,
	CableDriverMapModelCriteria,
} from "../models/cabledrivermap.model";
import { CableService } from "./cable.service";
export class CableDriverMapService extends BaseService {
	sql_get: string = `
    SELECT [id]
        ,[cable_id]
        ,[cable_name]
        ,[driver_id]
        ,[driver_name]
        ,[precept_association_id]
        ,[created_by]
        ,[modified_by]
        ,[created_on]
        ,[modified_on]
        ,[is_active]
        ,[is_suspended]
        ,[parent_id]
        ,[is_factory]
        ,[notes]
    FROM [dbo].[tblCableDriver]
    `;
	sql_save: string = `
    INSERT INTO [dbo].[tblCableDriver]
        ([cable_id]
        ,[cable_name]
		,[driver_id]
		,[driver_name]
        ,[precept_association_id]
        ,[created_by]
        ,[modified_by]
        ,[created_on]
        ,[modified_on]
        ,[is_active]
        ,[is_suspended]
        ,[parent_id]
        ,[is_factory]
        ,[notes])
    OUTPUT INSERTED.*
    VALUES
        (
            @cable_id,
            @cable_name,
			@driver_id,
			@driver_name,
            @precept_association_id,
            @created_by,
            @modified_by,
            @created_on, 
            @modified_on,
            @is_active,
            @is_suspended,
            @parent_id,
            @is_factory,
            @notes
        )
    `;
	async get(
		_cable_driver_map: CableDriverMapModel
	): Promise<Array<CableDriverMapModel>> {
		var result: Array<CableDriverMapModel> = [];
		try {
			await using(this.db.getDisposablePool(), async (pool) => {
				const client: ConnectionPool = await pool.connect();
				const transaction: Transaction = pool.getTransaction(client);
				try {
					await transaction.begin();
					var qb = new this.utils.QueryBuilder(this.sql_get);
					if (_cable_driver_map.id > 0) {
						qb.addParameter("id", _cable_driver_map.id, "=");
					}
					if (_cable_driver_map.cable_name.length > 0) {
						qb.addParameter(
							"cable_name",
							_cable_driver_map.cable_name,
							"="
						);
					}
					var query_string = qb.getQuery();
					var result_temp: IResult<any> = await pool
						.getRequest(transaction)
						.query(query_string);
					if (_.get(result_temp, "recordset", null) != null) {
						_.forEach(result_temp.recordset, (v: any) => {
							var temp = new CableDriverMapModel(v);
							temp.id = parseInt(v.id.toString());
							temp.driver_id = parseInt(v.driver_id.toString());
							temp.cable_id = parseInt(v.cable_id);
							temp.precept_association_id = parseInt(
								v.precept_association_id
							);
							temp.modified_by = parseInt(v.modified_by);
							temp.created_by = parseInt(v.created_by);
							result.push(temp);
						});
					}
					await transaction.commit();
				} catch (error) {
					if (!(error instanceof ErrorResponse))
						await transaction.rollback();
					throw error;
				}
			});
		} catch (error) {
			throw error;
		}
		return result;
	}
	async saveOnPreceptService(
		_cable_driver_map: CableDriverMapModel
	): Promise<CableDriverMapModel> {
		var result: CableDriverMapModel = new CableDriverMapModel();
		try {
			var config = {
				headers: {
					"Content-Type": "application/json",
					Accept: "application/json",
				},
			};
			var post_data = {
				DriverId: _cable_driver_map.driver_id,
				DongleId: _cable_driver_map.cable_name,
				Status: 1,
			};
			var url = `${this.environment.GWS_URL}/AddUpdateCable`;
			var resp = await axios.post(url, post_data, config);
			if (_.has(resp, "data.Status")) {
				if (resp.data.Status > 0) {
					_cable_driver_map.precept_association_id = resp.data.Status;
					result = _cable_driver_map;
				} else {
					throw new ErrorResponse({
						message: "Error associating cable",
					});
				}
			}
		} catch (error) {
			throw error;
		}
		return result;
	}
	async saveOnDB(
		_cable_driver_map: CableDriverMapModel
	): Promise<CableDriverMapModel> {
		var result: CableDriverMapModel = new CableDriverMapModel();
		try {
			await using(this.db.getDisposablePool(), async (pool) => {
				const client: ConnectionPool = await pool.connect();
				const transaction: Transaction = pool.getTransaction(client);
				try {
					await transaction.begin();
					var result_temp: IResult<any> = await pool
						.getRequest(transaction)
						.input(
							"cable_id",
							this.db.TYPES.BigInt,
							_cable_driver_map.cable_id
						)
						.input(
							"cable_name",
							this.db.TYPES.VarChar,
							_cable_driver_map.cable_name
						)
						.input(
							"driver_id",
							this.db.TYPES.BigInt,
							_cable_driver_map.driver_id
						)
						.input(
							"driver_name",
							this.db.TYPES.VarChar,
							_cable_driver_map.driver_name
						)
						.input(
							"precept_association_id",
							this.db.TYPES.BigInt,
							_cable_driver_map.precept_association_id
						)
						.input(
							"created_by",
							this.db.TYPES.BigInt,
							_cable_driver_map.created_by
						)
						.input(
							"modified_by",
							this.db.TYPES.BigInt,
							_cable_driver_map.modified_by
						)
						.input("created_on", this.db.TYPES.DateTime, new Date())
						.input("modified_on", this.db.TYPES.DateTime, null)
						.input("is_active", this.db.TYPES.Bit, true)
						.input("is_suspended", this.db.TYPES.Bit, false)
						.input(
							"parent_id",
							this.db.TYPES.SmallInt,
							_cable_driver_map.parent_id
						)
						.input(
							"is_factory",
							this.db.TYPES.Bit,
							_cable_driver_map.is_factory
						)
						.input(
							"notes",
							this.db.TYPES.VarChar,
							_cable_driver_map.notes
						)

						.query(this.sql_save);
					if (_.get(result_temp, "recordset.0", null) != null) {
						var record = result_temp.recordset[0];
						result = new CableDriverMapModel(record);
						result.id = parseInt(record.id);
						result.cable_id = parseInt(record.cable_id);
						result.created_by = parseInt(record.created_by);
						result.driver_id = parseInt(record.driver_id);
						result.precept_association_id = parseInt(
							record.precept_association_id
						);
						result.modified_by = parseInt(record.modified_by);
					}
					await transaction.commit();
				} catch (error) {
					if (!(error instanceof ErrorResponse)) {
						await transaction.rollback();
					}
					throw error;
				}
			});
		} catch (error) {
			throw error;
		}
		return result;
	}
	async save(_req: CableDriverMapModel): Promise<CableDriverMapModel> {
		var result: CableDriverMapModel = new CableDriverMapModel();
		try {
			var cable_driver_map_list = await this.get(
				new CableDriverMapModel({
					cable_name: _req.cable_name,
				})
			);
			if (cable_driver_map_list.length > 0) {
				throw new ErrorResponse({
					message: "Cable already associated",
				});
			}
			var cable_service = new CableService();
			var cable_list = await cable_service.getCable(
				new CableModel({
					cable_name: _req.cable_name,
				})
			);
			if (cable_list.length == 0) {
				throw new ErrorResponse({
					message: "Cable not registered",
				});
			}
			_req.driver_id = cable_list[0].driver_id;

			var precept_service_resp = await this.saveOnPreceptService(_req);
			var db_resp = await this.saveOnDB(precept_service_resp);
			result = db_resp;
		} catch (error) {
			throw error;
		}
		return result;
	}
	async saveBulk(_req: Array<CableDriverMapModelCriteria>) {
		var result: Array<CableDriverMapModelCriteria> = [];
		try {
			var promise_list: Array<Promise<any>> = [];
			_.forEach(_req, (v) => {
				promise_list.push(
					new Promise(async (resolve, reject) => {
						var result: CableDriverMapModelCriteria = new CableDriverMapModelCriteria();
						try {
							var temp = await this.save(v);
							result = new CableDriverMapModelCriteria(temp);
						} catch (error) {
							v.error = JSON.stringify(error);
							resolve(v);
						}
						resolve(result);
					})
				);
			});
			result = await Promise.all(promise_list);
		} catch (error) {
			throw error;
		}
		return result;
	}
}
