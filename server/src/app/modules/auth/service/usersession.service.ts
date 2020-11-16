import { using, Environment, QueryBuilder } from "../../global/utils";
import { BaseService } from "./base.service";
import * as _ from "lodash";
import { ErrorResponse } from "../../global/models/errorres.model";
import { UserSession } from "../models/usersession.model";
import { ConnectionPool, Transaction, IResult } from "mssql";
import * as uuid from "uuid";
export class UserSessionService extends BaseService {
	sql_insert: string = `
    INSERT INTO [tblUserSession]
           ([refresh_token]
           ,[isas_refresh_token]
		   ,[isas_access_token]
		   ,[lsl_access_token]
           ,[user_id]
           ,[start_time]
           ,[end_time]
           ,[last_active]
           ,[is_expired]
           ,[killed_by]
           ,[is_active]
           ,[created_by]
           ,[created_on]
           ,[modified_by]
           ,[modified_on]
           ,[user_info])
     OUTPUT INSERTED.*
     VALUES
           (@refresh_token,
           @isas_refresh_token,
		   @isas_access_token,
		   @lsl_access_token,
           @user_id,
           @start_time,
           @end_time,
           @last_active,
           @is_expired,
           @killed_by,
           @is_active, 
           @created_by, 
           @created_on,
           @modified_by, 
           @modified_on,
           @user_info)
    `;
	sql_get = `
    SELECT [id]
      ,[refresh_token]
      ,[isas_refresh_token]
	  ,[isas_access_token]
	  ,[lsl_access_token]
      ,[user_id]
      ,[start_time]
      ,[end_time]
      ,[last_active]
      ,[is_expired]
      ,[killed_by]
      ,[is_active]
      ,[created_by]
      ,[created_on]
      ,[modified_by]
      ,[modified_on]
      ,[user_info]
    FROM [dbo].[tblUserSession]
	`;
	sql_get_order_by_modifiedon = `
    SELECT [id]
      ,[refresh_token]
      ,[isas_refresh_token]
	  ,[isas_access_token]
	  ,[lsl_access_token]
      ,[user_id]
      ,[start_time]
      ,[end_time]
      ,[last_active]
      ,[is_expired]
      ,[killed_by]
      ,[is_active]
      ,[created_by]
      ,[created_on]
      ,[modified_by]
      ,[modified_on]
      ,[user_info]
	FROM [dbo].[tblUserSession]
	`;
	sql_update = `
    UPDATE [tblUserSession]
    SET [isas_refresh_token] = @isas_refresh_token
      ,[isas_access_token] = @isas_access_token
      ,[end_time] = @end_time
      ,[last_active] = @last_active
      ,[is_active] = @is_active
      ,[modified_by] = @modified_by
      ,[modified_on] = @modified_on
      ,[is_expired] = @is_expired
      ,[killed_by] = @killed_by
    OUTPUT INSERTED.*
    WHERE [refresh_token] = @refresh_token;
    `;
	async insert(_usersession: UserSession) {
		var result = new UserSession();
		try {
			await using(this.db.getDisposablePool(), async (pool) => {
				const client: ConnectionPool = await pool.connect();
				// const transaction: Transaction = pool.getTransaction(client);
				try {
					// await transaction.begin();
					var { recordset }: IResult<any> = await pool
						.getRequest(client)
						.input(
							"refresh_token",
							this.db.TYPES.VarChar,
							uuid.v4()
						)
						.input(
							"isas_refresh_token",
							this.db.TYPES.NVarChar,
							_usersession.isas_refresh_token
						)
						.input(
							"isas_access_token",
							this.db.TYPES.NVarChar,
							_usersession.isas_access_token
						)
						.input(
							"lsl_access_token",
							this.db.TYPES.NVarChar,
							_usersession.lsl_access_token
						)
						.input(
							"user_id",
							this.db.TYPES.VarChar,
							_usersession.user_id
						)
						.input("start_time", this.db.TYPES.DateTime, new Date())
						.input("end_time", this.db.TYPES.DateTime, null)
						.input(
							"last_active",
							this.db.TYPES.DateTime,
							new Date()
						)
						.input("is_expired", this.db.TYPES.Bit, false)
						.input("killed_by", this.db.TYPES.VarChar, "")
						.input("is_active", this.db.TYPES.Bit, true)
						.input(
							"created_by",
							this.db.TYPES.VarChar,
							_usersession.user_id
						)
						.input("created_on", this.db.TYPES.DateTime, new Date())
						.input(
							"modified_by",
							this.db.TYPES.VarChar,
							_usersession.user_id
						)
						.input(
							"modified_on",
							this.db.TYPES.DateTime,
							new Date()
						)
						.input(
							"user_info",
							this.db.TYPES.NVarChar,
							JSON.stringify(_usersession.user_info)
						)
						.query(this.sql_insert);
					if (_.has(recordset, "0")) {
						var row = recordset[0];
						result.id = parseInt(row.id);
						result.refresh_token = row.refresh_token;
						result.isas_refresh_token = row.isas_refresh_token;
						result.isas_access_token = row.isas_access_token;
						result.lsl_access_token = row.lsl_access_token;
						result.start_time = row.start_time;
						result.end_time = row.end_time;
						result.last_active = row.last_active;
						result.user_id = row.user_id;
						result.killed_by = row.killed_by;
						result.is_expired = row.is_expired;
						result.created_by = row.created_by;
						result.created_on = row.created_on;
						result.modified_by = row.modified_by;
						result.modified_on = row.modified_on;
						result.is_active = row.is_active;
						result.user_info =
							row.user_info != ""
								? JSON.parse(row.user_info)
								: {};
					}
				} catch (transaction_error) {
					throw transaction_error;
				}
			});
		} catch (error) {
			throw error;
		}
		return result;
	}
	async get(_usersession: UserSession) {
		var result: Array<UserSession> = new Array<UserSession>();
		try {
			await using(this.db.getDisposablePool(), async (pool) => {
				var client = await pool.connect();
				var qb = new this.utils.QueryBuilder(this.sql_get);
				if (_usersession.id > 0)
					qb.addParameter("id", _usersession.id, "=");
				if (_usersession.refresh_token != "")
					qb.addParameter(
						"refresh_token",
						_usersession.refresh_token,
						"="
					);
				if (_usersession.isas_access_token != "")
					qb.addParameter(
						"isas_access_token",
						_usersession.isas_access_token,
						"="
					);
				var query_string = qb.getQuery();
				var { recordset }: IResult<any> = await client.query(
					query_string
				);

				_.forEach(recordset, (v) => {
					var user_session = new UserSession();
					user_session.id = parseInt(v.id);
					user_session.refresh_token = v.refresh_token;
					user_session.isas_refresh_token = v.isas_refresh_token;
					user_session.isas_access_token = v.isas_access_token;
					user_session.lsl_access_token = v.lsl_access_token;
					user_session.start_time = v.start_time;
					user_session.end_time = v.end_time;
					user_session.last_active = v.last_active;
					user_session.user_id = v.user_id;
					user_session.killed_by = v.killed_by;
					user_session.is_expired = v.is_expired;
					user_session.created_by = v.created_by;
					user_session.created_on = v.created_on;
					user_session.modified_by = v.modified_by;
					user_session.modified_on = v.modified_on;
					user_session.is_active = v.is_active;
					user_session.user_info =
						v.user_info != "" ? JSON.parse(v.user_info) : {};
					result.push(user_session);
				});
			});
		} catch (error) {
			throw error;
		}
		return result;
	}
	async getUserSessionOrderByModifiedOn(_usersession: UserSession) {
		var result: Array<UserSession> = new Array<UserSession>();
		try {
			await using(this.db.getDisposablePool(), async (pool) => {
				var client = await pool.connect();
				var qb = new this.utils.QueryBuilder(
					this.sql_get_order_by_modifiedon
				);
				qb.addParameter("is_expired", 0, "=");
				if (_usersession.user_id != "")
					qb.addParameter("user_id", _usersession.user_id, "=");
				qb.sort_field = "[modified_on]";
				qb.sort_type = QueryBuilder.sort_types.desc;
				var query_string = qb.getQuery();
				var { recordset }: IResult<any> = await client.query(
					query_string
				);

				_.forEach(recordset, (v) => {
					var user_session = new UserSession();
					user_session.id = parseInt(v.id);
					user_session.refresh_token = v.refresh_token;
					user_session.isas_refresh_token = v.isas_refresh_token;
					user_session.isas_access_token = v.isas_access_token;
					user_session.lsl_access_token = v.lsl_access_token;
					user_session.start_time = v.start_time;
					user_session.end_time = v.end_time;
					user_session.last_active = v.last_active;
					user_session.user_id = v.user_id;
					user_session.killed_by = v.killed_by;
					user_session.is_expired = v.is_expired;
					user_session.created_by = v.created_by;
					user_session.created_on = v.created_on;
					user_session.modified_by = v.modified_by;
					user_session.modified_on = v.modified_on;
					user_session.is_active = v.is_active;
					user_session.user_info =
						v.user_info != "" ? JSON.parse(v.user_info) : {};
					result.push(user_session);
				});
			});
		} catch (error) {
			throw error;
		}
		return result;
	}
	async update(_usersession: UserSession) {
		var result = new UserSession();
		try {
			await using(this.db.getDisposablePool(), async (pool) => {
				const client: ConnectionPool = await pool.connect();
				const transaction: Transaction = pool.getTransaction(client);
				try {
					await transaction.begin();
					var { recordset }: IResult<any> = await pool
						.getRequest(transaction)
						.input(
							"refresh_token",
							this.db.TYPES.VarChar,
							_usersession.refresh_token
						)
						.input(
							"isas_refresh_token",
							this.db.TYPES.NVarChar,
							_usersession.isas_refresh_token
						)
						.input(
							"isas_access_token",
							this.db.TYPES.NVarChar,
							_usersession.isas_access_token
						)
						.input(
							"end_time",
							this.db.TYPES.DateTime,
							_usersession.end_time
						)
						.input(
							"last_active",
							this.db.TYPES.DateTime,
							new Date()
						)
						.input(
							"is_expired",
							this.db.TYPES.Bit,
							_usersession.is_expired
						)
						.input(
							"killed_by",
							this.db.TYPES.VarChar,
							_usersession.killed_by
						)
						.input(
							"is_active",
							this.db.TYPES.Bit,
							_usersession.is_active
						)
						.input(
							"modified_by",
							this.db.TYPES.VarChar,
							_usersession.user_id
						)
						.input(
							"modified_on",
							this.db.TYPES.DateTime,
							new Date()
						)
						.query(this.sql_update);
					if (_.has(recordset, "0")) {
						var row = recordset[0];
						result.id = parseInt(row.id);
						result.refresh_token = row.refresh_token;
						result.isas_refresh_token = row.isas_refresh_token;
						result.isas_access_token = row.isas_access_token;
						result.start_time = row.start_time;
						result.end_time = row.end_time;
						result.last_active = row.last_active;
						result.user_id = row.user_id;
						result.killed_by = row.killed_by;
						result.is_expired = row.is_expired;
						result.created_by = row.created_by;
						result.created_on = row.created_on;
						result.modified_by = row.modified_by;
						result.modified_on = row.modified_on;
						result.is_active = row.is_active;
					}
					await transaction.commit();
				} catch (transaction_error) {
					if (!(transaction_error instanceof ErrorResponse)) {
						await transaction.rollback();
					}
					throw transaction_error;
				}
			});
		} catch (error) {
			throw error;
		}
		return result;
	}
}
