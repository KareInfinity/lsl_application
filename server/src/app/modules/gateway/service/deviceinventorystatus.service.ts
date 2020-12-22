import { using, Environment } from "../../global/utils";
import { BaseService } from "./base.service";
import * as _ from "lodash";
import { ErrorResponse } from "../../global/models/errorres.model";
import { ConnectionPool, Transaction, IResult } from "mssql";
import * as uuid from "uuid";
import moment from "moment";
import {
	DeviceInventoryStatusModel,
	DeviceInventoryStatusModelCriteria,
	InventoryStatusModel,
} from "../models/inventorystatus.model";
import { AppSettingsModel } from "../models/appsettings.model";
import { AppSettingsService } from "./appsettings.service";

export class DeviceInventoryStatusService extends BaseService {
	constructor() {
		super();
		this.environment = new Environment();
	}
	environment: Environment;
	sql_get_inventory_status_list = `
	SELECT [id]
      ,[inventory_status_key]
      ,[inventory_status_text]
      ,[created_by]
      ,[modified_by]
      ,[created_on]
      ,[modified_on]
      ,[is_active]
      ,[is_suspended]
      ,[parent_id]
      ,[is_factory]
      ,[notes]
  	FROM [dbo].[tblInventoryStatus]
	WHERE is_active = 1`;
	sql_insert_inventory_status: string = `
	BEGIN
		IF EXISTS ( SELECT * FROM tblInventoryStatus WHERE inventory_status_key = @inventory_status_key and is_active = 0 )
		BEGIN
			UPDATE tblInventoryStatus
			SET is_active = 1
			OUTPUT INSERTED.id
			WHERE inventory_status_key = @inventory_status_key;
		END
		ELSE IF EXISTS ( SELECT * FROM tblInventoryStatus WHERE inventory_status_key = @inventory_status_key and is_active = 1 )
		BEGIN
			SELECT -1 as id, 1008 as error_code, 'Inventory status already exists' as message
		END
		ELSE
		BEGIN
			INSERT tblInventoryStatus (inventory_status_key, inventory_status_text, is_active, is_factory, created_by, created_on, modified_by, modified_on)
			OUTPUT INSERTED.id
			VALUES (@inventory_status_key, @inventory_status_text, 1, 0, @created_by, @created_on, @modified_by, @modified_on)
		END
	END`;
	sql_update_inventory_status: string = `
		update tblInventoryStatus 
		set	
			inventory_status_text = @inventory_status_text,
			modified_on = @modified_on,
			modified_by = @modified_by
		OUTPUT inserted.*
		where
			id = @id and 
			is_factory = 0;

		`;
	sql_delete_inventory_status: string = `
		update tblInventoryStatus 
		set	
			is_active = 0,
			modified_on = @modified_on,
			modified_by = @modified_by
		OUTPUT inserted.*
		where
			id = @id;

		`;
	// sql_update_inventory_status = `
	// 	UPDATE tblInventoryStatus SET inventory_status_text = @inventory_status_text
	// 	WHERE id = @id`;
	sql_get_device_inventory_status = `
	SELECT [dis].[id]
		,[dis].[device_id]
		,[dis].[inventory_status_id]
		,[dis].[created_by]
		,[dis].[modified_by]
		,[dis].[created_on]
		,[dis].[modified_on]
		,[dis].[is_active]
		,[dis].[is_suspended]
		,[dis].[parent_id]
		,[dis].[is_factory]
		,[dis].[notes]
		,[mis].[inventory_status_text] [inventory_status]
	FROM [tblDeviceInventoryStatus] dis
	INNER JOIN tblInventoryStatus mis on dis.inventory_status_id = mis.id
	WHERE 
		dis.device_id = @device_id
		and dis.created_on between @from_date and @to_date
	ORDER BY dis.created_on DESC`;
	sql_update_device_inventory_status = `
		IF EXISTS (SELECT 1 FROM tblDeviceInventoryStatus WHERE device_id = @device_id AND is_active = 1)
		BEGIN
			UPDATE tblDeviceInventoryStatus SET is_active = 0 
			WHERE device_id = @device_id AND is_active = 1
		END
		INSERT tblDeviceInventoryStatus (device_id, inventory_status_id, is_active, created_by, created_on)
		OUTPUT INSERTED.id
		VALUES (@device_id, @inventory_status_id, 1, @created_by, @created_on)`;

	async getInventoryStatuseList(_req: InventoryStatusModel) {
		var result: Array<InventoryStatusModel> = new Array<InventoryStatusModel>();
		try {
			await using(this.db.getDisposablePool(), async (pool) => {
				const client: ConnectionPool = await pool.connect();
				var qb = new this.utils.QueryBuilder(
					this.sql_get_inventory_status_list
				);
				if (_req.id > 0) {
					qb.addParameter("id", _req.id, "=");
				}
				var query_string = qb.getQuery();
				var result_temp: IResult<any> = await pool
					.getRequest(client)
					.query(query_string);

				if (_.has(result_temp, "recordset.0")) {
					_.forEach(result_temp.recordset, (v) => {
						var _tmp = new InventoryStatusModel(v);
						_tmp.id = parseInt(v.id);
						result.push(_tmp);
					});
				}
			});
		} catch (error) {
			throw error;
		}
		return result;
	}

	async saveInventoryStatus(
		_req: InventoryStatusModel
	): Promise<InventoryStatusModel> {
		try {
			await using(this.db.getDisposablePool(), async (pool) => {
				const client: ConnectionPool = await pool.connect();
				var result_temp: IResult<any> = await pool
					.getRequest(client)
					.input(
						"inventory_status_key",
						this.db.TYPES.VarChar,
						_req.inventory_status_text
							.replace(" ", "_")
							.toUpperCase()
					)
					.input(
						"inventory_status_text",
						this.db.TYPES.VarChar,
						_req.inventory_status_text
					)
					.input("created_by", this.db.TYPES.BigInt, _req.created_by)
					.input("created_on", this.db.TYPES.DateTime, new Date())
					.input(
						"modified_by",
						this.db.TYPES.BigInt,
						_req.modified_by
					)
					.input("modified_on", this.db.TYPES.DateTime, new Date())
					.input("is_active", this.db.TYPES.Bit, 1)
					.input("is_factory", this.db.TYPES.Bit, 0)
					.query(this.sql_insert_inventory_status);
				if (_.has(result_temp, "recordset.0")) {
					if (result_temp.recordset[0].id != -1) {
						_req.id = result_temp.recordset[0].id;
					} else {
						var error_obj = result_temp.recordset[0];
						switch (error_obj.error_code) {
							case ErrorResponse.ErrorCodes
								.INVENTORY_STATUS_ALREADY_EXISTS:
								throw new ErrorResponse({
									code:
										ErrorResponse.ErrorCodes
											.INVENTORY_STATUS_ALREADY_EXISTS,
									message: "Inventory status already Exists",
								});
								break;
							// case ErrorResponse.ErrorCodes
							// 	.INVENTORY_STATUS_REVIVED:
							// 	throw new ErrorResponse({
							// 		code:
							// 			ErrorResponse.ErrorCodes
							// 				.INVENTORY_STATUS_REVIVED,
							// 		message: "Inventory status revived",
							// 	});
							// 	break;
							default:
								break;
						}
					}
				}
			});
		} catch (error) {
			throw error;
		}
		return _req;
	}
	async updateInventoryStatus(
		_req: InventoryStatusModel
	): Promise<InventoryStatusModel> {
		try {
			await using(this.db.getDisposablePool(), async (pool) => {
				const client: ConnectionPool = await pool.connect();
				var result_temp: IResult<any> = await pool
					.getRequest(client)
					.input("id", this.db.TYPES.BigInt, _req.id)
					.input(
						"inventory_status_text",
						this.db.TYPES.VarChar,
						_req.inventory_status_text
					)
					.input(
						"modified_by",
						this.db.TYPES.BigInt,
						_req.modified_by
					)
					.input("modified_on", this.db.TYPES.DateTime, new Date())
					.query(this.sql_update_inventory_status);
				if (_.has(result_temp, "recordset.0")) {
					_req.id = result_temp.recordset[0].id;
				}
			});
		} catch (error) {
			throw error;
		}
		return _req;
	}
	async deleteInventoryStatus(
		_req: InventoryStatusModel
	): Promise<InventoryStatusModel> {
		try {
			await using(this.db.getDisposablePool(), async (pool) => {
				const client: ConnectionPool = await pool.connect();
				var result_temp: IResult<any> = await pool
					.getRequest(client)
					.input("id", this.db.TYPES.BigInt, _req.id)
					.input(
						"modified_by",
						this.db.TYPES.BigInt,
						_req.modified_by
					)
					.input("modified_on", this.db.TYPES.DateTime, new Date())
					.query(this.sql_delete_inventory_status);
				if (_.has(result_temp, "recordset.0")) {
					_req.id = result_temp.recordset[0].id;
				}
			});
		} catch (error) {
			throw error;
		}
		return _req;
	}

	async getDeviceInventoryStatusList(
		_req: DeviceInventoryStatusModelCriteria
	) {
		var result: Array<DeviceInventoryStatusModel> = new Array<DeviceInventoryStatusModel>();
		try {
			if (_req.from_date == null && _req.to_date == null) {
				var appsettings_service = new AppSettingsService();
				var settings: AppSettingsModel = await appsettings_service.getSettings(
					AppSettingsModel.types.LSL_PAGES
				);
				var page: any = _.find(settings.value.pages, (v) => {
					return v.key == "DEVICE_INVENTORY_STATUS_HISTORY";
				});
				if (_.has(page, "date_range.value")) {
					_req.to_date = new Date();
					_req.from_date = moment(_req.to_date)
						.subtract(page.date_range.value, page.date_range.unit)
						.toDate();
				} else {
					_req.to_date = new Date();
					_req.from_date = new Date();
				}
			}
			await using(this.db.getDisposablePool(), async (pool) => {
				const client: ConnectionPool = await pool.connect();
				var result_temp: IResult<any> = await pool
					.getRequest(client)
					.input("device_id", this.db.TYPES.BigInt, _req.device_id)
					.input("from_date", this.db.TYPES.DateTime, _req.from_date)
					.input("to_date", this.db.TYPES.DateTime, _req.to_date)
					.query(this.sql_get_device_inventory_status);

				if (_.has(result_temp, "recordset.0")) {
					_.forEach(result_temp.recordset, (v) => {
						var tmp = new DeviceInventoryStatusModel(v);
						tmp.id = parseInt(v.id);
						tmp.device_id = parseInt(v.device_id);
						tmp.inventory_status_id = parseInt(
							v.inventory_status_id
						);
						tmp.inventory_status = v.inventory_status;
						tmp.created_by = v.created_by;
						tmp.created_on = v.created_on;
						result.push(tmp);
					});
				}
			});
		} catch (error) {
			throw error;
		}
		return result;
	}

	async updateDeviceInventoryStatus(
		_req: DeviceInventoryStatusModel
	): Promise<boolean> {
		var result: boolean = false;
		try {
			await using(this.db.getDisposablePool(), async (pool) => {
				const client: ConnectionPool = await pool.connect();
				const transaction: Transaction = pool.getTransaction(client);
				try {
					await transaction.begin();
					var result_temp: IResult<any> = await pool
						.getRequest(transaction)
						.input(
							"inventory_status_id",
							this.db.TYPES.TinyInt,
							_req.inventory_status_id
						)
						.input(
							"device_id",
							this.db.TYPES.BigInt,
							_req.device_id
						)
						.input(
							"created_by",
							this.db.TYPES.BigInt,
							_req.created_by
						)
						.input("created_on", this.db.TYPES.DateTime, new Date())
						.input("is_active", this.db.TYPES.Bit, true)
						.query(this.sql_update_device_inventory_status);
					await transaction.commit();
					if (result_temp == null || result_temp.recordset == null) {
						throw new ErrorResponse({
							// error_code: ErrorResponse.ERROR_CODE.DM_2000,
							// error_message: `There was some issue in Creating the Data`,
						});
					}
					if (
						result_temp != null &&
						result_temp.recordset != null &&
						result_temp.recordset.length > 0
					) {
						if (result_temp.recordset[0].id <= 0) {
							throw new ErrorResponse({
								// error_code: ErrorResponse.ERROR_CODE.DM_2000,
								// error_message: `There was some issue in Creating the Data`,
							});
						}
						if (result_temp.recordset[0].id > 0) result = true;
					}
				} catch (transaction_error) {
					if (!(transaction_error instanceof ErrorResponse)) {
						await transaction.rollback();
						var error_number = _.get(
							transaction_error,
							"number",
							0
						);
						switch (error_number) {
							case 2627:
								throw new ErrorResponse({
									// error_code: ErrorResponse.ERROR_CODE.DM_MEDNET_URL_DUPLICATE,
									// error_message: "Inventory status already exist",
									// notification: _messages.mednet_url_create_failed
								});
								break;
								dafault: break;
						}
					}
					throw transaction_error;
				}
			});
		} catch (error) {
			throw new ErrorResponse({
				// error_message: error?.error_message,
				// notification: notification_messages.mednet_url_create_fail(_mednet.url),
			});
			// throw error;
		}
		return result;
	}
}
