import { using, Environment } from "../../global/utils";
import { BaseService } from "./base.service";
import * as _ from "lodash";
import { IResult, ConnectionPool, Transaction } from "mssql";
import { DriverModel } from "../models/driver.model";
import { ErrorResponse } from "../../global/models/errorres.model";

export class DriverService extends BaseService {
	sql_get_driver: string = `SELECT * FROM tblDriver`;
	sql_insert_driver: string = `Insert into tblDriver (driver_code, driver_name, 
		created_by, created_on, is_active) 
	OUTPUT INSERTED.id values (@driver_code, @driver_name, 
        @created_by, @created_on, @is_active)`;
	sql_update_driver = `Update tblDriver set driver_code = @driver_code, 
    driver_name = @driver_name, modified_by = @modified_by, 
    modified_on = @modified_on, is_active = @is_active 
    where id = @id; select @@rowcount as recordcount`;

	async getDriver(
		_req: DriverModel = new DriverModel()
	): Promise<Array<DriverModel>> {
		let result: Array<DriverModel> = new Array<DriverModel>();
		try {
			await using(this.db.getDisposablePool(), async (pool) => {
				const client: ConnectionPool = await pool.connect();
				try {
					var qb = new this.utils.QueryBuilder(this.sql_get_driver);
					if (_req.driver_code != "") {
						qb.addParameter("driver_code", _req.driver_code, "=");
					}
					var query_string = qb.getQuery();
					var result_temp: IResult<any> = await client.query(
						query_string
					);
					if (_.get(result_temp, "recordset", null) != null) {
						_.forEach(result_temp.recordset, (v: any) => {
							var temp = new DriverModel(v);
							temp.id = parseInt(v.id);
							temp.precent_driver_id = parseInt(
								v.precept_driver_id
							);

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

	async insertDriverInfo(_driver_model: DriverModel): Promise<boolean> {
		let result: boolean = false;
		try {
			await using(this.db.getDisposablePool(), async (pool) => {
				const client: ConnectionPool = await pool.connect();
				const transaction: Transaction = pool.getTransaction(client);
				try {
					await transaction.begin();
					var result_temp: IResult<any> = await pool
						.getRequest(transaction)
						.input(
							"driver_code",
							this.db.TYPES.VarChar,
							_driver_model.driver_code
						)
						.input(
							"driver_name",
							this.db.TYPES.VarChar,
							_driver_model.driver_name
						)
						.input(
							"created_by",
							this.db.TYPES.BigInt,
							_driver_model.created_by
						)
						.input(
							"created_on",
							this.db.TYPES.DateTime,
							_driver_model.created_on
						)
						.input(
							"is_active",
							this.db.TYPES.Bit,
							_driver_model.is_active
						)
						.query(this.sql_insert_driver);
					if (result_temp.recordset.length > 0)
						_.get(result_temp, "recordset.0.id", 0) > 0
							? (result = true)
							: (result = false);
					else result = false;
					await transaction.commit();
					if (
						!result &&
						_.get(result_temp, "recordset.0.id", 0) == 0
					) {
						throw new ErrorResponse({
							item: _driver_model,
							message: `There was some issue in Creating the Data`,
						});
					}
				} catch (transaction_scope_error) {
					if (!(transaction_scope_error instanceof ErrorResponse)) {
						await transaction.rollback();
						throw new ErrorResponse<DriverModel>({
							message: transaction_scope_error.message,
							item: _driver_model,
						});
						// throw transaction_scope_error;
					} else throw transaction_scope_error;
				}
			});
		} catch (error) {
			throw error;
		}
		return result;
	}
	async updateDriverInfo(_driver_model: DriverModel): Promise<boolean> {
		let result: boolean = false;
		try {
			await using(this.db.getDisposablePool(), async (pool) => {
				const client: ConnectionPool = await pool.connect();
				const transaction: Transaction = pool.getTransaction(client);
				try {
					await transaction.begin();
					var result_temp: IResult<any> = await pool
						.getRequest(transaction)
						.input("id", this.db.TYPES.BigInt, _driver_model.id)
						.input(
							"driver_code",
							this.db.TYPES.VarChar,
							_driver_model.driver_code
						)
						.input(
							"driver_name",
							this.db.TYPES.VarChar,
							_driver_model.driver_name
						)
						.input(
							"modified_by",
							this.db.TYPES.BigInt,
							_driver_model.modified_by
						)
						.input(
							"modified_on",
							this.db.TYPES.DateTime,
							_driver_model.modified_on
						)
						.input(
							"is_active",
							this.db.TYPES.Bit,
							_driver_model.is_active
						)
						.query(this.sql_update_driver);
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
						throw new ErrorResponse<DriverModel>({
							message: transaction_scope_error.message,
							item: _driver_model,
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
