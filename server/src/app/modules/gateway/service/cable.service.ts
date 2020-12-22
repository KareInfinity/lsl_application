import { using, Environment } from "../../global/utils";
import { BaseService } from "./base.service";
import * as _ from "lodash";
import { IResult, ConnectionPool, Transaction } from "mssql";
import { CableModel } from "../models/cable.model";
import axios from "axios";
import { ErrorResponse } from "../../global/models/errorres.model";
export class CableService extends BaseService {
	sql_get_cable: string = `SELECT * FROM tblCable`;

	sql_insert_cable: string = `Insert into tblCable (cable_name, created_by, created_on, is_active, driver_id) 
    OUTPUT INSERTED.* values (@cable_name, @created_by, @created_on, @is_active, @driver_id)`;

	sql_update_cable = `Update tblCable set cable_name = @cable_name, 
    modified_by = @modified_by, modified_on = @modified_on, is_active = @is_active 
    where id = @id; select @@rowcount as recordcount`;

	async getCable(
		_req: CableModel = new CableModel()
	): Promise<Array<CableModel>> {
		let result: Array<CableModel> = new Array<CableModel>();
		try {
			await using(this.db.getDisposablePool(), async (pool) => {
				const client: ConnectionPool = await pool.connect();
				try {
					var qb = new this.utils.QueryBuilder(this.sql_get_cable);
					if (_req.cable_name.length > 0) {
						qb.addParameter("cable_name", _req.cable_name, "=");
					}
					var query_string = qb.getQuery();
					var result_temp: IResult<any> = await client.query(
						query_string
					);
					if (_.get(result_temp, "recordset", null) != null) {
						_.forEach(result_temp.recordset, (v: any) => {
							var temp = new CableModel(v);
							temp.id = parseInt(v.id);
							temp.driver_id = parseInt(v.driver_id);
							// temp.idh_session_id = parseInt(v.idh_session_id.toString());
							result.push(temp);
						});
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
	async save(_cable: CableModel): Promise<boolean> {
		var result: boolean = false;
		try {
			var config = {
				headers: {
					"Content-Type": "application/json",
					Accept: "application/json",
				},
			};
			var post_data = {
				// DriverId: _cable.driver_id,
				DongleId: _cable.cable_name,
				Status: 1,
			};
			var url = `${this.environment.GWS_URL}/AddUpdateCable`;
			var resp = await axios.post(url, post_data, config);
			if (_.has(resp, "data.Status")) {
				if (resp.data.Status > 0) {
					result = true;
				} else {
					throw new ErrorResponse({
						message: "Error adding cable",
					});
				}
			}
		} catch (error) {
			throw error;
		}
		return result;
	}

	async insertCableInfo(_cable_model: CableModel): Promise<CableModel> {
		let result: CableModel = new CableModel();
		try {
			await using(this.db.getDisposablePool(), async (pool) => {
				const client: ConnectionPool = await pool.connect();
				var result_temp: IResult<any> = await pool
					.getRequest(client)
					.input(
						"cable_name",
						this.db.TYPES.VarChar,
						_cable_model.cable_name
					)
					.input(
						"created_by",
						this.db.TYPES.BigInt,
						_cable_model.created_by
					)
					.input(
						"created_on",
						this.db.TYPES.DateTime,
						_cable_model.created_on
					)
					.input(
						"is_active",
						this.db.TYPES.Bit,
						_cable_model.is_active
					)
					.input(
						"driver_id",
						this.db.TYPES.BigInt,
						_cable_model.driver_id
					)
					.query(this.sql_insert_cable);
				if (_.has(result_temp, "recordset.0")) {
					var v: any = result_temp.recordset[0];
					result = new CableModel(v);
					result.id = parseInt(v.id);
					result.driver_id = parseInt(v.driver_id);
					result.created_by = parseInt(v.created_by);
					result.modified_by = parseInt(v.modified_by);
				}
			});
		} catch (error) {
			throw error;
		}
		return result;
	}
	async updateCableInfo(_cable_model: CableModel): Promise<boolean> {
		let result: boolean = false;
		try {
			await using(this.db.getDisposablePool(), async (pool) => {
				const client: ConnectionPool = await pool.connect();
				const transaction: Transaction = pool.getTransaction(client);
				try {
					await transaction.begin();
					var result_temp: IResult<any> = await pool
						.getRequest(transaction)
						.input("id", this.db.TYPES.BigInt, _cable_model.id)
						.input(
							"cable_name",
							this.db.TYPES.VarChar,
							_cable_model.cable_name
						)
						.input(
							"modified_by",
							this.db.TYPES.BigInt,
							_cable_model.modified_by
						)
						.input(
							"modified_on",
							this.db.TYPES.DateTime,
							_cable_model.modified_on
						)
						.input(
							"is_active",
							this.db.TYPES.Bit,
							_cable_model.is_active
						)
						.query(this.sql_update_cable);
					if (result_temp.recordset.length > 0)
						_.get(result_temp, "recordset.0.recordcount", 0) > 0
							? (result = true)
							: (result = false);
					else result = false;
					await transaction.commit();
					if (
						!result &&
						_.get(result_temp, "recordset.0.recordcount", 0) == 0
					) {
						throw new ErrorResponse({
							message: `There was some issue in Updation of the Data`,
						});
					}
				} catch (transaction_scope_error) {
					if (!(transaction_scope_error instanceof ErrorResponse)) {
						await transaction.rollback();
						throw new ErrorResponse<CableModel>({
							message: transaction_scope_error.message,
							item: _cable_model,
						});
					} else throw transaction_scope_error;
				}
			});
		} catch (error) {
			throw error;
		}
		return result;
	}
}
