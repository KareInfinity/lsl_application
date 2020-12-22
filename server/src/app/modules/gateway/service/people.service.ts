import { BaseService } from "./base.service";
import * as _ from "lodash";
import { PeopleModel } from "../models/people.model";
import { ConnectionPool, Transaction, IResult } from "mssql";
import { using } from "../../global/utils";
import {
	DevicePeopleModel,
	DevicePeopleModelCriteria,
} from "../models/devicepeople.model";
import { ErrorResponse } from "../../global/models/errorres.model";
import { DeviceService } from "./device.service";
import { DeviceModel, DeviceModelCriteria } from "../models/device.model";
import { CableService } from "./cable.service";
import { CableModel } from "../models/cable.model";
import { DriverService } from "./driver.service";
import { DriverModel } from "../models/driver.model";
import { CableDriverMapModel } from "../models/cabledrivermap.model";
import axios from "axios";
import { notification_messages } from "../utils/notificationmessages";
export class PeopleService extends BaseService {
	sql_get_people_with_pagination = `
	SELECT [id]
		,[people_type]
		,[people_class]
		,[external_id]
		,[dob]
		,[admission_dttm]
		,[first_name]
		,[middle_name]
		,[last_name]
		,[title]
		,[gender]
		,[alias]
		,[race]
		,[people_address]
		,[country_code]
		,[phone_home]
		,[phone_business]
		,[primary_language]
		,[marital_status]
		,[religion]
		,[primary_account_no]
		,[is_discharged]
		,[discharged_dttm]
		,[is_alive]
		,[death_dttm]
		,[point_of_care]
		,[room]
		,[bed]
		,[facility]
		,[building]
		,[visit_number]
		,[people_height]
		,[people_weight]
		,[diagnosis_code]
		,[is_registered]
		,[created_by]
		,[modified_by]
		,[created_on]
		,[modified_on]
		,[is_active]
		,[is_suspended]
		,[parent_id]
		,[is_factory]
		,[notes]
		,total_count = COUNT(*) OVER()
	FROM [tblPeople]
	@condition
	order by id desc
	offset @skip rows
	fetch next @size rows only
	`;
	sql_get_people: string = `
	SELECT id, people_type, people_class, external_id, dob, admission_dttm, first_name, middle_name, 
	last_name, title, gender, alias, race, people_address, country_code, phone_home, phone_business, 
	primary_language, marital_status, religion, primary_account_no, is_discharged, discharged_dttm, 
	is_alive, death_dttm, point_of_care, room, bed, facility, building, visit_number, people_height, 
	people_weight, diagnosis_code, is_registered, created_by, modified_by, created_on, modified_on, 
	is_active, is_suspended, parent_id, is_factory, notes, attributes
    FROM [tblPeople]
    `;
	sql_insert_people = `
	INSERT INTO [dbo].[tblPeople]
			([people_type]
			,[people_class]
			,[external_id]
			,[dob]
			,[admission_dttm]
			,[first_name]
			,[middle_name]
			,[last_name]
			,[title]
			,[gender]
			,[alias]
			,[race]
			,[people_address]
			,[country_code]
			,[phone_home]
			,[phone_business]
			,[primary_language]
			,[marital_status]
			,[religion]
			,[primary_account_no]
			,[is_discharged]
			,[discharged_dttm]
			,[is_alive]
			,[death_dttm]
			,[point_of_care]
			,[room]
			,[bed]
			,[facility]
			,[building]
			,[visit_number]
			,[people_height]
			,[people_weight]
			,[diagnosis_code]
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
			(@people_type
			,@people_class
			,@external_id
			,@dob
			,@admission_dttm
			,@first_name
			,@middle_name
			,@last_name
			,@title
			,@gender
			,@alias
			,@race
			,@people_address
			,@country_code
			,@phone_home
			,@phone_business
			,@primary_language
			,@marital_status
			,@religion
			,@primary_account_no
			,@is_discharged
			,@discharged_dttm
			,@is_alive
			,@death_dttm
			,@point_of_care
			,@room
			,@bed
			,@facility
			,@building
			,@visit_number
			,@people_height
			,@people_weight
			,@diagnosis_code
			,@created_by
			,@modified_by
			,@created_on
			,@modified_on
			,@is_active
			,@is_suspended
			,@parent_id
			,@is_factory
			,@notes)
	`;
	sql_update_people = `
	UPDATE [tblPeople]
		SET [people_type] = @people_type
      	,[people_class] = @people_class
		,[external_id] = @external_id
		,[dob] = @dob
		,[admission_dttm] = @admission_dttm
		,[first_name] = @first_name
		,[middle_name] = @middle_name
		,[last_name] = @last_name
		,[title] = @title
		,[gender] = @gender
		,[alias] = @alias
		,[race] = @race
		,[people_address] = @people_address
		,[country_code] = @country_code
		,[phone_home] = @phone_home
		,[phone_business] = @phone_business
		,[primary_language] = @primary_language
		,[marital_status] = @marital_status
		,[religion] = @religion
		,[primary_account_no] = @primary_account_no
		,[is_discharged] = @is_discharged
		,[discharged_dttm] = @discharged_dttm
		,[is_alive] = @is_alive
		,[death_dttm] = @death_dttm
		,[point_of_care] = @point_of_care
		,[room] = @room
		,[bed] = @bed
		,[facility] = @facility
		,[building] = @building
		,[visit_number] = @visit_number
		,[people_height] = @people_height
		,[people_weight] = @people_weight
		,[diagnosis_code] = @diagnosis_code
		,[is_registered] = @is_registered
		,[modified_by] = @modified_by
		,[modified_on] = @modified_on
		,[is_active] = @is_active
		,[is_suspended] = @is_suspended
		,[parent_id] = @parent_id
		,[is_factory] = @is_factory
		,[notes] = @notes
		,[attributes] = @attributes
	OUTPUT inserted.*
	WHERE id = @id;
	`;
	sql_get_people_device_association: string = `
        SELECT [devicepeople].[id]
            ,[devicepeople].[device_id]
            ,[device].[serial_no] device_serial_no
            ,[device].[device_name] device_name
            ,[device].[device_type] device_type
            ,[devicepeople].[people_id] 
            ,[people].[external_id] people_external_id
            ,CONCAT([people].[first_name],' ',[people].[middle_name],' ',[people].[last_name]) people_fullname
            ,[devicepeople].user_id 
            ,[users].external_id user_external_id
            ,CONCAT([users].[first_name],' ',[users].[middle_name],' ',[users].[last_name]) user_fullname
            ,[devicepeople].[request_status]
            ,[devicepeople].[valid_from]
            ,[devicepeople].[valid_to]
            ,[devicepeople].[created_by]
            ,[devicepeople].[modified_by]
            ,[devicepeople].[created_on]
            ,[devicepeople].[modified_on]
            ,[devicepeople].[is_active]
            ,[devicepeople].[is_suspended]
            ,[devicepeople].[parent_id]
            ,[devicepeople].[is_factory]
            ,[devicepeople].[notes]
        FROM [tblDevicePeople] [devicepeople]
        left join tblDevice [device] on [device].[id] = [devicepeople].[device_id]
        left join tblPeople [people] on [people].[id] = [devicepeople].[people_id]
        left join tblPeople [users] on [users].[id] = [devicepeople].[user_id]
		`;

	sql_get_associated_devices: string = `
        SELECT [devicepeople].[id]
            ,[devicepeople].[device_id]
            ,[device].[serial_no] device_serial_no
            ,[device].[device_name] device_name
            ,[device].[device_type] device_type
            ,[devicepeople].[people_id] 
            ,[people].[external_id] people_external_id
            ,CONCAT([people].[first_name],' ',[people].[middle_name],' ',[people].[last_name]) people_fullname
            ,[devicepeople].user_id 
            ,[users].external_id user_external_id
            ,CONCAT([users].[first_name],' ',[users].[middle_name],' ',[users].[last_name]) user_fullname
            ,[devicepeople].[request_status]
            ,[devicepeople].[valid_from]
            ,[devicepeople].[valid_to]
            ,[devicepeople].[created_by]
            ,[devicepeople].[modified_by]
            ,[devicepeople].[created_on]
            ,[devicepeople].[modified_on]
            ,[devicepeople].[is_active]
            ,[devicepeople].[is_suspended]
            ,[devicepeople].[parent_id]
            ,[devicepeople].[is_factory]
            ,[devicepeople].[notes]
        FROM [tblDevicePeople] [devicepeople]
        inner join tblDevice [device] on [device].[id] = [devicepeople].[device_id]
        inner join tblPeople [people] on [people].[id] = [devicepeople].[people_id]
        inner join tblPeople [users] on [users].[id] = [devicepeople].[user_id]
		`;

	sql_insert_devicepeople = `
	INSERT INTO [dbo].[tblDevicePeople]
			([device_id]
			,[people_id]
			,[user_id]
			,[request_status]
			,[valid_from]
			,[valid_to]
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
			(@device_id
			,@people_id
			,@user_id
			,@request_status
			,@valid_from
			,@valid_to
			,@created_by
			,@modified_by
			,@created_on
			,@modified_on
			,@is_active
			,@is_suspended
			,@parent_id
			,@is_factory
			,@notes)

	`;
	sql_update_devicepeople = `
	UPDATE [dbo].[tblDevicePeople]
	SET [device_id] = @device_id
		,[people_id] = @people_id
		,[user_id] = @user_id
		,[request_status] = @request_status
		,[valid_from] = @valid_from
		,[valid_to] = @valid_to
		,[created_by] = @created_by
		,[modified_by] = @modified_by
		,[created_on] = @created_on
		,[modified_on] = @modified_on
		,[is_active] = @is_active
		,[is_suspended] = @is_suspended
		,[parent_id] = @parent_id
		,[is_factory] = @is_factory
		,[notes] = @notes
	OUTPUT INSERTED.*
	WHERE id = @id
	`;
	async getWithPagination(
		_req: PeopleModel,
		page: number,
		size: number
	): Promise<{ items: Array<PeopleModel>; total_count: number }> {
		var items: Array<PeopleModel> = [];
		var total_count: number = 0;
		try {
			await using(this.db.getDisposablePool(), async (pool) => {
				var client = await pool.connect();
				var query = this.sql_get_people_with_pagination;
				var condition_array: Array<any> = [];
				if (_req.external_id.trim().length > 0) {
					condition_array.push(
						`external_id like '%${_req.external_id}%'`
					);
				}
				if (_req.people_type.trim().length > 0) {
					condition_array.push(
						`people_type like '%${_req.people_type}%'`
					);
				}
				if (_req.first_name.trim().length > 0) {
					condition_array.push(
						`first_name like '%${_req.first_name}%'`
					);
				}
				if (_req.middle_name.trim().length > 0) {
					condition_array.push(
						`middle_name like '%${_req.middle_name}%'`
					);
				}
				if (_req.last_name.trim().length > 0) {
					condition_array.push(
						`last_name like '%${_req.last_name}%'`
					);
				}
				if (_req.people_class.trim().length > 0) {
					condition_array.push(
						`people_class like '%${_req.people_class}%'`
					);
				}
				if (_req.point_of_care.trim().length > 0) {
					condition_array.push(
						`point_of_care like '%${_req.point_of_care}%'`
					);
				}
				if (_req.room.trim().length > 0) {
					condition_array.push(`room like '%${_req.room}%'`);
				}

				// if (_device.device_name.trim().length > 0) {
				// 	condition_array.push(
				// 		`device_name like '%${_device.device_name}%'`
				// 	);
				// }
				// if (_device.device_type.trim().length > 0) {
				// 	condition_array.push(
				// 		`device_type like '%${_device.device_type}%'`
				// 	);
				// }
				// if (_device.serial_no.trim().length > 0) {
				// 	condition_array.push(
				// 		`serial_no like '%${_device.serial_no}%'`
				// 	);
				// }
				// condition_array.push(
				// 	`is_commissioned = '${_device.is_commissioned}'`
				// );
				if (condition_array.length > 0) {
					var condition_temp = condition_array.join(" and ");
					query = query.replace(
						"@condition",
						`where ${condition_temp}`
					);
				} else {
					query = query.replace("@condition", "");
				}
				var { recordset }: IResult<any> = await pool
					.getRequest(client)
					.input("skip", (page - 1) * size)
					.input("size", size)
					.query(query);
				if (recordset.length > 0) {
					_.forEach(recordset, (v) => {
						var people_temp = new PeopleModel(v);
						people_temp.id = parseInt(v.id);
						people_temp.created_by = parseInt(v.created_by);
						people_temp.modified_by = parseInt(v.modified_by);
						people_temp.attributes = new PeopleModel.Attributes(
							v.attributes
						);
						items.push(people_temp);
					});
					total_count = recordset[0].total_count;
				}
			});
		} catch (error) {
			throw error;
		}
		return { items, total_count };
	}
	async getPeople(_req: PeopleModel): Promise<Array<PeopleModel>> {
		let result: Array<PeopleModel> = new Array<PeopleModel>();
		try {
			await using(this.db.getDisposablePool(), async (pool) => {
				const client: ConnectionPool = await pool.connect();
				var qb = new this.utils.QueryBuilder(this.sql_get_people);
				if (_req.id != 0) {
					qb.addParameter("id", _req.id, "=");
				}
				if (_req.external_id.length > 0) {
					qb.addParameter("external_id", _req.external_id, "=");
				}
				if (_req.people_type.length > 0) {
					qb.addParameter("people_type", _req.people_type, "=");
				}
				var query_string = qb.getQuery();
				var { recordset }: IResult<any> = await client.query(
					query_string
				);
				if (recordset.length > 0) {
					_.forEach(recordset, (v) => {
						var _people_temp = new PeopleModel(v);
						_people_temp.id = parseInt(v.id);
						_people_temp.created_by = parseInt(v.created_by);
						_people_temp.modified_by = parseInt(v.created_by);
						result.push(_people_temp);
					});
				}
			});
		} catch (error) {
			throw error;
		}
		return result;
	}

	async getDevicePeople(
		_req: DevicePeopleModelCriteria
	): Promise<Array<DevicePeopleModelCriteria>> {
		let result: Array<DevicePeopleModelCriteria> = new Array<DevicePeopleModelCriteria>();
		try {
			await using(this.db.getDisposablePool(), async (pool) => {
				const client: ConnectionPool = await pool.connect();
				var qb = new this.utils.QueryBuilder(
					this.sql_get_people_device_association
				);
				if (_req.device_id > 0) {
					qb.addParameter(
						"[devicepeople].device_id",
						_req.device_id,
						"="
					);
				}
				if (_req.user_id > 0) {
					qb.addParameter(
						"[devicepeople].user_id",
						_req.user_id,
						"="
					);
				}
				if (_req.people_id > 0) {
					qb.addParameter(
						"[devicepeople].people_id",
						_req.people_id,
						"="
					);
				}
				if (_req.people_external_id.length > 0) {
					qb.addParameter(
						"[people].[external_id]",
						_req.people_external_id,
						"="
					);
				}
				if (_req.device_serial_no.length > 0) {
					qb.addParameter(
						"[device].[serial_no]",
						_req.device_serial_no,
						"="
					);
				}
				if (_req.is_active == true) {
					qb.addParameter("[devicepeople].is_active", 1, "=");
				} else {
					qb.addParameter("[devicepeople].is_active", 0, "=");
				}
				var query_string = qb.getQuery();
				var result_temp: IResult<any> = await client.query(
					query_string
				);
				if (result_temp.recordset.length > 0) {
					_.forEach(result_temp.recordset, (v) => {
						var _device_people_temp = new DevicePeopleModelCriteria(
							v
						);
						_device_people_temp.people_id = parseInt(v.people_id);
						_device_people_temp.device_id = parseInt(v.device_id);
						_device_people_temp.id = parseInt(v.id);
						_device_people_temp.user_id = parseInt(v.user_id);
						//_device_people_temp.created_by = parseInt(v.created_by);
						result.push(_device_people_temp);
					});
				}
				// await transaction.commit();
			});
		} catch (error) {
			throw error;
		}
		return result;
	}

	async getAssociatedDevices(
		_req: DevicePeopleModelCriteria
	): Promise<Array<DevicePeopleModelCriteria>> {
		let result: Array<DevicePeopleModelCriteria> = new Array<DevicePeopleModelCriteria>();
		try {
			await using(this.db.getDisposablePool(), async (pool) => {
				const client: ConnectionPool = await pool.connect();
				var qb = new this.utils.QueryBuilder(
					this.sql_get_associated_devices
				);
				if (_req.people_external_id.length > 0) {
					qb.addParameter(
						"[people].external_id",
						_req.people_external_id,
						"="
					);
				}
				if (_req.is_active == true) {
					qb.addParameter(
						"[devicepeople].is_active",
						_req.is_active,
						"="
					);
				}
				var query_string = qb.getQuery();
				var result_temp: IResult<any> = await client.query(
					query_string
				);
				if (result_temp.recordset.length > 0) {
					_.forEach(result_temp.recordset, (v) => {
						var _device_people_temp = new DevicePeopleModelCriteria(
							v
						);
						_device_people_temp.people_id = parseInt(v.people_id);
						_device_people_temp.device_id = parseInt(v.device_id);
						_device_people_temp.id = parseInt(v.id);
						_device_people_temp.user_id = parseInt(v.user_id);
						//_device_people_temp.created_by = parseInt(v.created_by);
						result.push(_device_people_temp);
					});
				}
				// await transaction.commit();
			});
		} catch (error) {
			throw error;
		}
		return result;
	}

	async insertPeople(_req: PeopleModel): Promise<PeopleModel> {
		var result: PeopleModel = new PeopleModel();
		try {
			await using(this.db.getDisposablePool(), async (pool) => {
				const client: ConnectionPool = await pool.connect();
				const transaction: Transaction = pool.getTransaction(client);
				try {
					await transaction.begin();
					var result_temp: IResult<any> = await pool
						.getRequest(transaction)
						.input(
							"people_type",
							this.db.TYPES.VarChar,
							_req.people_type
						)
						.input(
							"people_class",
							this.db.TYPES.VarChar,
							_req.people_class
						)
						.input(
							"external_id",
							this.db.TYPES.VarChar,
							_req.external_id
						)
						.input("dob", this.db.TYPES.DateTime, _req.dob)
						.input(
							"admission_dttm",
							this.db.TYPES.DateTime,
							_req.admission_dttm
						)
						.input(
							"first_name",
							this.db.TYPES.VarChar,
							_req.first_name
						)
						.input(
							"middle_name",
							this.db.TYPES.VarChar,
							_req.middle_name
						)
						.input(
							"last_name",
							this.db.TYPES.VarChar,
							_req.last_name
						)
						.input("title", this.db.TYPES.VarChar, _req.title)
						.input("gender", this.db.TYPES.VarChar, _req.gender)
						.input("alias", this.db.TYPES.VarChar, _req.alias)
						.input("race", this.db.TYPES.VarChar, _req.race)
						.input(
							"people_address",
							this.db.TYPES.VarChar,
							_req.people_address
						)
						.input(
							"country_code",
							this.db.TYPES.VarChar,
							_req.country_code
						)
						.input(
							"phone_home",
							this.db.TYPES.VarChar,
							_req.phone_home
						)
						.input(
							"phone_business",
							this.db.TYPES.VarChar,
							_req.phone_business
						)
						.input(
							"primary_language",
							this.db.TYPES.VarChar,
							_req.primary_language
						)
						.input(
							"marital_status",
							this.db.TYPES.VarChar,
							_req.marital_status
						)
						.input("religion", this.db.TYPES.VarChar, _req.religion)
						.input(
							"primary_account_no",
							this.db.TYPES.VarChar,
							_req.primary_account_no
						)
						.input(
							"is_discharged",
							this.db.TYPES.Bit,
							_req.is_discharged
						)
						.input(
							"discharged_dttm",
							this.db.TYPES.DateTime,
							_req.discharged_dttm
						)
						.input("is_alive", this.db.TYPES.Bit, _req.is_alive)
						.input(
							"death_dttm",
							this.db.TYPES.DateTime,
							_req.death_dttm
						)
						.input(
							"point_of_care",
							this.db.TYPES.VarChar,
							_req.point_of_care
						)
						.input("room", this.db.TYPES.VarChar, _req.room)
						.input("bed", this.db.TYPES.VarChar, _req.bed)
						.input("facility", this.db.TYPES.VarChar, _req.facility)
						.input("building", this.db.TYPES.VarChar, _req.building)
						.input(
							"visit_number",
							this.db.TYPES.VarChar,
							_req.visit_number
						)
						.input(
							"people_height",
							this.db.TYPES.VarChar,
							_req.people_height
						)
						.input(
							"people_weight",
							this.db.TYPES.VarChar,
							_req.people_weight
						)
						.input(
							"diagnosis_code",
							this.db.TYPES.NVarChar,
							_req.diagnosis_code
						)
						.input(
							"created_by",
							this.db.TYPES.BigInt,
							_req.created_by
						)
						.input(
							"modified_by",
							this.db.TYPES.BigInt,
							_req.modified_by
						)
						.input("created_on", this.db.TYPES.DateTime, new Date())
						.input(
							"modified_on",
							this.db.TYPES.DateTime,
							new Date()
						)
						.input("is_active", this.db.TYPES.Bit, _req.is_active)
						.input(
							"is_suspended",
							this.db.TYPES.Bit,
							_req.is_suspended
						)
						.input(
							"parent_id",
							this.db.TYPES.SmallInt,
							_req.parent_id
						)
						.input("is_factory", this.db.TYPES.Bit, _req.is_factory)
						.input("notes", this.db.TYPES.VarChar, _req.notes)
						.query(this.sql_insert_people);
					if (_.has(result_temp, "recordset.0")) {
						var record = result_temp.recordset[0];
						result = new PeopleModel(record);
						result.id = parseInt(record.id);
						result.created_by = parseInt(record.created_by);
						result.modified_by = parseInt(record.modified_by);
						result.parent_id = parseInt(record.parent_id);
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
	async insertDevicePeople(
		_req: DevicePeopleModel
	): Promise<DevicePeopleModel> {
		var result: DevicePeopleModel = new DevicePeopleModel();
		try {
			await using(this.db.getDisposablePool(), async (pool) => {
				const client: ConnectionPool = await pool.connect();
				const transaction: Transaction = pool.getTransaction(client);
				try {
					await transaction.begin();
					var result_temp: IResult<any> = await pool
						.getRequest(transaction)
						.input(
							"device_id",
							this.db.TYPES.BigInt,
							_req.device_id
						)
						.input(
							"people_id",
							this.db.TYPES.BigInt,
							_req.people_id
						)
						.input("user_id", this.db.TYPES.BigInt, _req.user_id)
						.input(
							"request_status",
							this.db.TYPES.VarChar,
							_req.request_status
						)
						.input(
							"valid_from",
							this.db.TYPES.DateTime,
							_req.valid_from
						)
						.input(
							"valid_to",
							this.db.TYPES.DateTime,
							_req.valid_to
						)
						.input(
							"created_by",
							this.db.TYPES.BigInt,
							_req.created_by
						)
						.input(
							"modified_by",
							this.db.TYPES.BigInt,
							_req.modified_by
						)
						.input(
							"created_on",
							this.db.TYPES.DateTime,
							_req.created_on
						)
						.input(
							"modified_on",
							this.db.TYPES.DateTime,
							_req.modified_on
						)
						.input("is_active", this.db.TYPES.Bit, _req.is_active)
						.input(
							"is_suspended",
							this.db.TYPES.Bit,
							_req.is_suspended
						)
						.input(
							"parent_id",
							this.db.TYPES.SmallInt,
							_req.parent_id
						)
						.input("is_factory", this.db.TYPES.Bit, _req.is_factory)
						.input("notes", this.db.TYPES.VarChar, _req.notes)
						.query(this.sql_insert_devicepeople);
					if (_.has(result_temp, "recordset.0")) {
						var record = result_temp.recordset[0];
						result = new DevicePeopleModel(record);
						result.id = parseInt(record.id);
						result.people_id = parseInt(record.people_id);
						result.device_id = parseInt(record.device_id);
						result.user_id = parseInt(record.user_id);
						result.created_by = parseInt(record.created_by);
						result.modified_by = parseInt(record.modified_by);
						result.parent_id = parseInt(record.parent_id);
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
	async updateDevicePeople(
		_req: DevicePeopleModel
	): Promise<DevicePeopleModel> {
		var result: DevicePeopleModel = new DevicePeopleModel();
		try {
			await using(this.db.getDisposablePool(), async (pool) => {
				const client: ConnectionPool = await pool.connect();
				const transaction: Transaction = pool.getTransaction(client);
				try {
					await transaction.begin();
					var result_temp: IResult<any> = await pool
						.getRequest(transaction)
						.input("id", this.db.TYPES.BigInt, _req.id)
						.input(
							"device_id",
							this.db.TYPES.BigInt,
							_req.device_id
						)
						.input(
							"people_id",
							this.db.TYPES.BigInt,
							_req.people_id
						)
						.input("user_id", this.db.TYPES.BigInt, _req.user_id)
						.input(
							"request_status",
							this.db.TYPES.VarChar,
							_req.request_status
						)
						.input(
							"valid_from",
							this.db.TYPES.DateTime,
							_req.valid_from
						)
						.input(
							"valid_to",
							this.db.TYPES.DateTime,
							_req.valid_to
						)
						.input(
							"created_by",
							this.db.TYPES.BigInt,
							_req.created_by
						)
						.input(
							"modified_by",
							this.db.TYPES.BigInt,
							_req.modified_by
						)
						.input(
							"created_on",
							this.db.TYPES.DateTime,
							_req.created_on
						)
						.input(
							"modified_on",
							this.db.TYPES.DateTime,
							_req.modified_on
						)
						.input("is_active", this.db.TYPES.Bit, _req.is_active)
						.input(
							"is_suspended",
							this.db.TYPES.Bit,
							_req.is_suspended
						)
						.input(
							"parent_id",
							this.db.TYPES.SmallInt,
							_req.parent_id
						)
						.input("is_factory", this.db.TYPES.Bit, _req.is_factory)
						.input("notes", this.db.TYPES.VarChar, _req.notes)
						.query(this.sql_update_devicepeople);
					if (_.has(result_temp, "recordset.0")) {
						var record = result_temp.recordset[0];
						result = new DevicePeopleModel(record);
						result.id = parseInt(record.id);
						result.people_id = parseInt(record.people_id);
						result.device_id = parseInt(record.device_id);
						result.user_id = parseInt(record.user_id);
						result.created_by = parseInt(record.created_by);
						result.modified_by = parseInt(record.modified_by);
						result.parent_id = parseInt(record.parent_id);
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

	async getUserPeopleDeviceInformation(
		_logged_in_user: PeopleModel,
		_req: DevicePeopleModelCriteria
	): Promise<{
		user: PeopleModel;
		people: PeopleModel;
		device: DeviceModel;
	}> {
		var {
			user,
			people,
			device,
		}: { user: PeopleModel; people: PeopleModel; device: DeviceModel } = {
			user: new PeopleModel(),
			people: new PeopleModel(),
			device: new DeviceModel(),
		};
		try {
			/* get User */
			var user_list: Array<PeopleModel> = await this.getPeople(
				new PeopleModel({
					id: _logged_in_user.id,
				})
			);
			if (user_list.length == 0) {
				// user = await this.insertPeople(
				// 	new PeopleModel({
				// 		people_id: _logged_in_user.id,
				// 		first_name: _logged_in_user.name,
				// 		is_active: true,
				// 		people_type: PeopleModel.PEOPLE_TYPE.employee,
				// 	})
				// );
				throw new ErrorResponse({
					message: "User not found",
				});
			} else {
				user = user_list[0];
			}

			/* Get people */
			var people_list: Array<PeopleModel> = await this.getPeople(
				new PeopleModel({
					external_id: _req.people_external_id,
				})
			);
			if (people_list.length == 0) {
				people = await this.insertPeople(
					new PeopleModel({
						external_id: _req.people_external_id,
						is_active: true,
						people_type: PeopleModel.PEOPLE_TYPE.patient,
					})
				);
			} else {
				people = people_list[0];
			}

			/* ger Device */
			var device_service = new DeviceService();
			var device_list = await device_service.get(
				new DeviceModelCriteria({
					serial_no: _req.device_serial_no,
					device_type: _req.device_type,
				})
			);
			if (device_list.length == 0) {
				throw new ErrorResponse({
					code: ErrorResponse.ErrorCodes.DEVICE_NOT_FOUND,
					message: "Device not found",
				});
			}
			device = device_list[0];
		} catch (error) {
			throw error;
		}
		return { user, people, device };
	}

	async associate(
		_logged_in_user: PeopleModel,
		_req: DevicePeopleModelCriteria
	) {
		var result: boolean = false;
		try {
			/* get user, people and device information */
			var {
				user,
				people,
				device,
			} = await this.getUserPeopleDeviceInformation(
				_logged_in_user,
				_req
			);

			/* check whether device is already associated */
			var device_people_list = await this.getDevicePeople(
				new DevicePeopleModelCriteria({
					device_id: device.id,
					is_active: true,
				})
			);
			if (device_people_list.length > 0) {
				if (_req.override == false) {
					throw new ErrorResponse({
						code:
							ErrorResponse.ErrorCodes.DEVICE_ALREADY_ASSOCIATED,
						message: "Device is already associated",
					});
				} else {
					await this.disssociate(_logged_in_user, _req);
				}
			}

			/* Associate request log */
			var devicepeople = await this.insertDevicePeople(
				new DevicePeopleModel({
					request_status:
						DevicePeopleModel.RequestStatusList.associate_request,
					people_id: people.id,
					user_id: user.id,
					device_id: device.id,
					is_active: false,
					created_by: user.id,
				})
			);

			/* Precept service call */
			var is_associated: boolean = false;

			switch (_req.device_type) {
				case DeviceModel.DeviceTypes.idh:
					is_associated = await this.saveIDHAssociationDissociationOnPreceptService(
						{
							sIDHSerialNumber: _req.device_serial_no,
							sPatientID: _req.people_external_id,
						}
					);
					break;
				case DeviceModel.DeviceTypes.dexcom:
					var driver_code = "DexcomG6D";
					/* get driver */
					var driver_service = new DriverService();
					var driver_list = await driver_service.getDriver(
						new DriverModel({
							driver_code,
						})
					);
					if (driver_list.length == 0) {
						throw new ErrorResponse({
							code: ErrorResponse.ErrorCodes.DRIVER_NOT_FOUND,
							message: "Driver not found",
						});
					}
					var driver = driver_list[0];
					is_associated = await this.saveDexcomAssociationDissociationOnPreceptService(
						_req,
						{
							DongleId: "",
							DriverId: driver.precent_driver_id,
							Status: 1,
							attribute: [
								{
									Type: "patient_id",
									Value: _req.people_external_id,
								},
								{
									Type: "device_serial_no",
									Value: _req.device_serial_no,
								},
								{
									Type: "device_type",
									Value: _req.device_type,
								},
							],
						}
					);
					break;
				default:
					throw new ErrorResponse({
						code: ErrorResponse.ErrorCodes.DEVICE_TYPE_INVALID,
						message: "Invalid device type",
					});
			}

			if (is_associated) {
				/* Association success log */
				devicepeople.is_active = true;
				devicepeople.request_status =
					DevicePeopleModel.RequestStatusList.associated;
				devicepeople = await this.updateDevicePeople(devicepeople);
				result = true;
			}
		} catch (error) {
			throw error;
		}
		return result;
	}
	async disssociate(
		_logged_in_user: PeopleModel,
		_req: DevicePeopleModelCriteria
	) {
		var result: boolean = false;
		try {
			/* get user, people and device information */
			var {
				user,
				people,
				device,
			} = await this.getUserPeopleDeviceInformation(
				_logged_in_user,
				_req
			);

			/* check whether device is associated */
			var device_people_list = await this.getDevicePeople(
				new DevicePeopleModelCriteria({
					device_id: device.id,
					is_active: true,
				})
			);
			if (device_people_list.length == 0) {
				throw new ErrorResponse({
					code: ErrorResponse.ErrorCodes.DEVICE_IS_NOT_ASSOCIATED,
					message: "Device is not associated",
				});
			}
			var device_people: DevicePeopleModel = device_people_list[0];
			device_people.is_active = false;
			await this.updateDevicePeople(device_people);
			/* Associate request log */
			await this.insertDevicePeople(
				new DevicePeopleModel({
					request_status:
						DevicePeopleModel.RequestStatusList.dissociated,
					people_id: device_people.people_id,
					user_id: user.id,
					device_id: device_people.device_id,
					is_active: false,
					created_by: user.id,
				})
			);
			result = true;
		} catch (error) {
			throw error;
		}
		return result;
	}
	async saveDexcomAssociationDissociationOnPreceptService(
		_device_people: DevicePeopleModelCriteria,
		_req: {
			DriverId: number;
			DongleId: string;
			Status: 0 | 1;
			attribute: Array<{ Type: string; Value: string }>;
		}
	): Promise<boolean> {
		var result: boolean = false;
		try {
			var config = {
				headers: {
					"Content-Type": "application/json",
					Accept: "application/json",
				},
			};

			var url = `${this.environment.GWS_URL}/AssociateDexcom`;
			var resp = await axios.post(url, _req, config);
			if (_.has(resp, "data.Status")) {
				if (resp.data.Status > 0) {
					result = true;
				} else {
					throw new ErrorResponse({
						code: ErrorResponse.ErrorCodes.ERROR_ON_PRECEPT_SERVICE,
						message: "Error associating device",
						source: resp,
						notification: notification_messages.associate_dexcom_failure(
							_device_people.people_external_id,
							_device_people.device_serial_no,
							"ERROR_ON_PRECEPT"
						),
					});
				}
			}
		} catch (error) {
			if (error instanceof ErrorResponse) {
				throw error;
			} else {
				throw new ErrorResponse({
					code: ErrorResponse.ErrorCodes.ERROR_ON_PRECEPT_SERVICE,
					message: "Error associating device",
					source: error,
					notification: notification_messages.associate_dexcom_failure(
						_device_people.people_external_id,
						_device_people.device_serial_no,
						"ERROR_CODE : " +
							ErrorResponse.ErrorCodes.ERROR_ON_PRECEPT_SERVICE
					),
				});
			}
		}
		return result;
	}
	async saveIDHAssociationDissociationOnPreceptService(_req: {
		sPatientID: string;
		sIDHSerialNumber: string;
	}): Promise<boolean> {
		var result: boolean = false;
		try {
			var config = {
				headers: {
					"Content-Type": "application/json",
					Accept: "application/json",
				},
			};

			var url = `${this.environment.GWS_URL}/AssociateIDH`;
			var resp = await axios.post(url, _req, config);
			if (resp.data == true) {
				result = true;
			} else {
				throw new ErrorResponse({
					code: ErrorResponse.ErrorCodes.ERROR_ON_PRECEPT_SERVICE,
					message: "Error associating Device",
					source: resp,
					notification: notification_messages.associate_IDH_failure(
						_req.sPatientID,
						_req.sIDHSerialNumber,
						"ERROR_CODE : " +
							ErrorResponse.ErrorCodes.ERROR_ON_PRECEPT_SERVICE
					),
				});
			}
		} catch (error) {
			if (error instanceof ErrorResponse) {
				throw error;
			} else {
				throw new ErrorResponse({
					code: ErrorResponse.ErrorCodes.ERROR_ON_PRECEPT_SERVICE,
					message: "Error associating Device",
					source: error,
					notification: notification_messages.associate_IDH_failure(
						_req.sPatientID,
						_req.sIDHSerialNumber,
						"ERROR_CODE : " +
							ErrorResponse.ErrorCodes.ERROR_ON_PRECEPT_SERVICE
					),
				});
			}
		}
		return result;
	}
	async UpdatePeople(_req: PeopleModel): Promise<PeopleModel> {
		var result: PeopleModel = new PeopleModel();
		try {
			await using(this.db.getDisposablePool(), async (pool) => {
				const client: ConnectionPool = await pool.connect();
				const transaction: Transaction = pool.getTransaction(client);
				try {
					await transaction.begin();
					var result_temp: IResult<any> = await pool
						.getRequest(transaction)
						.input("id", this.db.TYPES.BigInt, _req.id)
						.input(
							"people_type",
							this.db.TYPES.VarChar,
							_req.people_type
						)
						.input(
							"people_class",
							this.db.TYPES.VarChar,
							_req.people_class
						)
						.input(
							"external_id",
							this.db.TYPES.VarChar,
							_req.external_id
						)
						.input("dob", this.db.TYPES.DateTime, _req.dob)
						.input(
							"admission_dttm",
							this.db.TYPES.DateTime,
							_req.admission_dttm
						)
						.input(
							"first_name",
							this.db.TYPES.VarChar,
							_req.first_name
						)
						.input(
							"middle_name",
							this.db.TYPES.VarChar,
							_req.middle_name
						)
						.input(
							"last_name",
							this.db.TYPES.VarChar,
							_req.last_name
						)
						.input("title", this.db.TYPES.VarChar, _req.title)
						.input("gender", this.db.TYPES.VarChar, _req.gender)
						.input("alias", this.db.TYPES.VarChar, _req.alias)
						.input("race", this.db.TYPES.VarChar, _req.race)
						.input(
							"people_address",
							this.db.TYPES.VarChar,
							_req.people_address
						)
						.input(
							"country_code",
							this.db.TYPES.VarChar,
							_req.country_code
						)
						.input(
							"phone_home",
							this.db.TYPES.VarChar,
							_req.phone_home
						)
						.input(
							"phone_business",
							this.db.TYPES.VarChar,
							_req.phone_business
						)
						.input(
							"primary_language",
							this.db.TYPES.VarChar,
							_req.primary_language
						)
						.input(
							"marital_status",
							this.db.TYPES.VarChar,
							_req.marital_status
						)
						.input("religion", this.db.TYPES.VarChar, _req.religion)
						.input(
							"primary_account_no",
							this.db.TYPES.VarChar,
							_req.primary_account_no
						)
						.input(
							"is_discharged",
							this.db.TYPES.Bit,
							_req.is_discharged
						)
						.input(
							"discharged_dttm",
							this.db.TYPES.DateTime,
							_req.discharged_dttm
						)
						.input("is_alive", this.db.TYPES.Bit, _req.is_alive)
						.input(
							"death_dttm",
							this.db.TYPES.DateTime,
							_req.death_dttm
						)
						.input(
							"point_of_care",
							this.db.TYPES.VarChar,
							_req.point_of_care
						)
						.input("room", this.db.TYPES.VarChar, _req.room)
						.input("bed", this.db.TYPES.VarChar, _req.bed)
						.input("facility", this.db.TYPES.VarChar, _req.facility)
						.input("building", this.db.TYPES.VarChar, _req.building)
						.input(
							"visit_number",
							this.db.TYPES.VarChar,
							_req.visit_number
						)
						.input(
							"people_height",
							this.db.TYPES.VarChar,
							_req.people_height
						)
						.input(
							"people_weight",
							this.db.TYPES.VarChar,
							_req.people_weight
						)
						.input(
							"diagnosis_code",
							this.db.TYPES.NVarChar,
							_req.diagnosis_code
						)
						.input(
							"is_registered",
							this.db.TYPES.Bit,
							_req.is_registered
						)

						.input(
							"modified_by",
							this.db.TYPES.BigInt,
							_req.modified_by
						)
						.input(
							"modified_on",
							this.db.TYPES.DateTime,
							new Date()
						)
						.input("is_active", this.db.TYPES.Bit, _req.is_active)
						.input(
							"is_suspended",
							this.db.TYPES.Bit,
							_req.is_suspended
						)
						.input(
							"parent_id",
							this.db.TYPES.SmallInt,
							_req.parent_id
						)
						.input("is_factory", this.db.TYPES.Bit, _req.is_factory)
						.input("notes", this.db.TYPES.VarChar, _req.notes)
						.input(
							"attributes",
							this.db.TYPES.NVarChar,
							JSON.stringify(_req.attributes)
						)
						.query(this.sql_update_people);
					if (_.has(result_temp, "recordset.0")) {
						var record = result_temp.recordset[0];
						result = new PeopleModel(record);
						result.id = parseInt(record.id);
						result.created_by = parseInt(record.created_by);
						result.modified_by = parseInt(record.modified_by);
						result.parent_id = parseInt(record.parent_id);
						result.attributes = new PeopleModel.Attributes(
							record.attributes
						);
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
}
