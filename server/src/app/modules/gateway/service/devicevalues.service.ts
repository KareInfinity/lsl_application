import { using, Environment } from "../../global/utils";
import { BaseService } from "./base.service";
import * as _ from "lodash";
import { ErrorResponse } from "../../global/models/errorres.model";
import { ConnectionPool, Transaction, IResult } from "mssql";
import * as uuid from "uuid";
import { DeviceModel } from "../models/device.model";
import { DeviceValues, CustomDeviceValues } from "../models/devicevalues.model";
import {
	DeviceBatteryValues,
	DeviceBatteryValuesCriteria,
} from "../models/devicebatteryvalues.model";
import { DeviceNetworkValues } from "../models/devicenetworkvalues.model";
import {
	IDHSessionsModel,
	IDHSessionsModelCriteria,
} from "../models/idhsessions.model";
import moment from "moment";
import { AppSettingsModel } from "../models/appsettings.model";
import { AppSettingsService } from "./appsettings.service";

export class DeviceValuesService extends BaseService {
	constructor() {
		super();
		this.environment = new Environment();
	}
	environment: Environment;
	sql_insert: string = ``;
	sql_get_idh_sessions: string = `SELECT id, session_guid, session_start, session_end 
	from tblIDHSessions (nolock) WHERE device_id = @device_id
	AND session_start >= @from_date_time
	AND session_end <= @to_date_time
	ORDER BY created_on DESC`;
	/* sql_get_device_values: string = `SELECT device_id, raw_value, raw_value_uom, created_on 
	FROM tblSessionDeviceRawValues`;*/
	sql_get_device_values: string = `
		IF OBJECT_ID('tempdb..#device_values_view') IS NOT NULL
			DROP TABLE #device_values_view
		CREATE TABLE #device_values_view (id SMALLINT IDENTITY(1,1), device_id BIGINT, message_direction varchar(200),
		device_event varchar(20), hl7_version VARCHAR(10), raw_value varchar(100), raw_value_uom varchar(20), created_on datetime)

		INSERT #device_values_view (device_id, message_direction, device_event, raw_value, raw_value_uom, created_on)
		SELECT device_id, NULL, NULL, convert(varchar(100), raw_value), raw_value_uom, created_on 
		FROM tblSessionDeviceRawValues WHERE device_id = @device_id AND idh_session_id = @idh_session_id
		AND created_on BETWEEN @from_date_time AND @to_date_time

		INSERT #device_values_view (device_id, message_direction, device_event, hl7_version, created_on)
		SELECT device_id, source_app + ' --> ' + target_app, hl7_msg_type, hl7_version, created_on
		FROM tblDeviceHL7Data WHERE device_id = @device_id AND idh_session_id = @idh_session_id
		AND created_on BETWEEN @from_date_time AND @to_date_time

		select * from #device_values_view ORDER BY created_on ASC`;

	sql_get_device_battery_values: string = `SELECT * FROM tblSessionDeviceBattery`;
	sql_get_device_network_values: string = `SELECT device_id, idh_session_id, created_on, STUFF((SELECT ', ' + interface_name + ' | ' + interface_value
		FROM tblDeviceNetworkConfig inner_table 
		WHERE inner_table.device_id  = outer_table.device_id AND inner_table.idh_session_id  = outer_table.idh_session_id
		AND is_active = 0
		FOR XML PATH('')), 1, 1, '') network_info
		FROM tblDeviceNetworkConfig outer_table WHERE device_id = @device_id AND is_active = 0
		AND created_on BETWEEN @from_date_time AND @to_date_time
		GROUP BY outer_table.device_id, outer_table.idh_session_id, outer_table.created_on
		ORDER BY created_on DESC`;
	sql_update = ` `;

	async getIDHSessionHistory(_input_req: IDHSessionsModelCriteria) {
		var result: Array<IDHSessionsModel> = new Array<IDHSessionsModel>();
		try {
			if (_input_req.from_date == null && _input_req.to_date == null) {
				var appsettings_service = new AppSettingsService();
				var settings: AppSettingsModel = await appsettings_service.getSettings(
					AppSettingsModel.types.LSL_PAGES
				);
				var page: any = _.find(settings.value.pages, (v) => {
					return v.key == "SESSION_HISTORY";
				});

				if (_.has(page, "date_range.value")) {
					_input_req.to_date = new Date();
					_input_req.from_date = moment(_input_req.to_date)
						.subtract(page.date_range.value, page.date_range.unit)
						.toDate();
				} else {
					_input_req.to_date = new Date();
					_input_req.from_date = new Date();
				}
			}
			await using(this.db.getDisposablePool(), async (pool) => {
				const client: ConnectionPool = await pool.connect();
				const transaction: Transaction = pool.getTransaction(client);
				await transaction.begin();
				var result_temp: IResult<any> = await pool
					.getRequest(transaction)
					.input(
						"device_id",
						this.db.TYPES.VarChar,
						_input_req.device_id
					)
					//.input("idh_session_id", this.db.TYPES.VarChar, _input_req.idh_session_id)
					.input(
						"from_date_time",
						this.db.TYPES.DateTimeOffset,
						_input_req.from_date
					)
					.input(
						"to_date_time",
						this.db.TYPES.DateTimeOffset,
						_input_req.to_date
					)
					.query(this.sql_get_idh_sessions);

				if (_.has(result_temp, "recordset.0")) {
					_.forEach(result_temp.recordset, (v) => {
						var _idh_device_sessions_tmp = new IDHSessionsModel(v);
						_idh_device_sessions_tmp.id = parseInt(v.id);
						result.push(_idh_device_sessions_tmp);
					});
				}
				await transaction.commit();
			});
		} catch (error) {
			throw error;
		}
		return result;
	}

	async getDeviceValuesHistory(_input_req: CustomDeviceValues) {
		var result: Array<CustomDeviceValues> = new Array<CustomDeviceValues>();
		try {
			if (_input_req.from_date == null && _input_req.to_date == null) {
				var appsettings_service = new AppSettingsService();
				var settings: AppSettingsModel = await appsettings_service.getSettings(
					AppSettingsModel.types.LSL_PAGES
				);
				var page: any = _.find(settings.value.pages, (v) => {
					return v.key == "DEVICE_HISTORY";
				});
				if (_.has(page, "date_range.value")) {
					_input_req.to_date = new Date();
					_input_req.from_date = moment(_input_req.to_date)
						.subtract(page.date_range.value, page.date_range.unit)
						.toDate();
				} else {
					_input_req.to_date = new Date();
					_input_req.from_date = new Date();
				}
			}
			await using(this.db.getDisposablePool(), async (pool) => {
				/* var client = await pool.connect();
				var qb = new this.utils.QueryBuilder(
					this.sql_get_device_values
				);
				if (_input_req.device_id > 0) {
					qb.addParameter("device_id", _input_req.device_id, "=");
				}
				if (_input_req.idh_session_id > 0) {
					qb.addParameter(
						"idh_session_id",
						_input_req.idh_session_id,
						"="
					);
				}
				qb.addParameter("created_on", from_date.toISOString(), ">")
				qb.addParameter("created_on", to_date.toISOString(), "<");
				qb.sort_field = "created_on";
				qb.sort_type = this.utils.QueryBuilder.sort_types.desc;
				var query_string = qb.getQuery();
				var { recordset }: IResult<any> = await client.query(
					query_string
				); 
				
				_.forEach(recordset, (v) => {
					var _device_values_tmp = new CustomDeviceValues();
					_device_values_tmp.device_id = parseInt(v.device_id);
					_device_values_tmp.app_info = v.app_info;
					_device_values_tmp.device_event = v.device_event;
					_device_values_tmp.raw_value = v.raw_value;
					// _device_values_tmp.raw_value = parseInt(v.raw_value);
					_device_values_tmp.raw_value_uom = v.raw_value_uom;
					_device_values_tmp.created_on = v.created_on;
					result.push(_device_values_tmp);
				});
				*/
				const client: ConnectionPool = await pool.connect();
				const transaction: Transaction = pool.getTransaction(client);
				await transaction.begin();
				var result_temp: IResult<any> = await pool
					.getRequest(transaction)
					.input(
						"device_id",
						this.db.TYPES.VarChar,
						_input_req.device_id
					)
					.input(
						"idh_session_id",
						this.db.TYPES.VarChar,
						_input_req.idh_session_id
					)
					.input(
						"from_date_time",
						this.db.TYPES.DateTimeOffset,
						_input_req.from_date
					)
					.input(
						"to_date_time",
						this.db.TYPES.DateTimeOffset,
						_input_req.to_date
					)
					.query(this.sql_get_device_values);

				if (_.has(result_temp, "recordset.0")) {
					_.forEach(result_temp.recordset, (v) => {
						var _device_values_tmp = new CustomDeviceValues();
						_device_values_tmp.device_id = parseInt(v.device_id);
						_device_values_tmp.message_direction =
							v.message_direction;
						_device_values_tmp.hl7_version = v.hl7_version;
						_device_values_tmp.device_event = v.device_event;
						_device_values_tmp.raw_value = v.raw_value;
						_device_values_tmp.raw_value_uom = v.raw_value_uom;
						_device_values_tmp.created_on = v.created_on;
						result.push(_device_values_tmp);
					});
				}
				await transaction.commit();
			});
		} catch (error) {
			throw error;
		}
		return result;
	}

	async getDeviceBatteryValuesHistory(
		_input_req: DeviceBatteryValuesCriteria
	) {
		var result: Array<DeviceBatteryValues> = new Array<DeviceBatteryValues>();
		try {
			if (_input_req.from_date == null && _input_req.to_date == null) {
				var appsettings_service = new AppSettingsService();
				var settings: AppSettingsModel = await appsettings_service.getSettings(
					AppSettingsModel.types.LSL_PAGES
				);
				var page: any = _.find(settings.value.pages, (v) => {
					return v.key == "IDH_BATTERY_HISTORY";
				});
				if (_.has(page, "date_range.value")) {
					_input_req.to_date = new Date();
					_input_req.from_date = moment(_input_req.to_date)
						.subtract(page.date_range.value, page.date_range.unit)
						.toDate();
				} else {
					_input_req.to_date = new Date();
					_input_req.from_date = new Date();
				}
			}
			await using(this.db.getDisposablePool(), async (pool) => {
				var client = await pool.connect();
				var qb = new this.utils.QueryBuilder(
					this.sql_get_device_battery_values
				);
				if (_input_req.device_id > 0) {
					qb.addParameter("device_id", _input_req.device_id, "=");
				}
				/* if (_input_req.idh_session_id > 0) {
					qb.addParameter(
						"idh_session_id",
						_input_req.idh_session_id,
						"="
					);
				} */
				qb.addParameter(
					"created_on",
					(_input_req.from_date as Date).toISOString(),
					">"
				);
				qb.addParameter(
					"created_on",
					(_input_req.to_date as Date).toISOString(),
					"<"
				);
				qb.sort_field = "created_on";
				qb.sort_type = this.utils.QueryBuilder.sort_types.desc;
				var query_string = qb.getQuery();
				var { recordset }: IResult<any> = await client.query(
					query_string
				);

				_.forEach(recordset, (v) => {
					var _device_battery_values_tmp = new DeviceBatteryValues();
					_device_battery_values_tmp.device_id = parseInt(
						v.device_id
					);
					_device_battery_values_tmp.idh_session_id =
						v.idh_session_id;
					_device_battery_values_tmp.device_id = v.device_id;
					_device_battery_values_tmp.status = v.status;
					_device_battery_values_tmp.warning = v.warning;
					_device_battery_values_tmp.activation_date =
						v.activation_date;
					_device_battery_values_tmp.expected_pm = v.expected_pm;
					_device_battery_values_tmp.unique_id = v.unique_id;
					_device_battery_values_tmp.temperature = v.temperature;
					_device_battery_values_tmp.serial_no = v.serial_no;
					_device_battery_values_tmp.manufacturer_name =
						v.manufacturer_name;
					_device_battery_values_tmp.manufactured_date =
						v.manufactured_date;
					_device_battery_values_tmp.current_energy =
						v.current_energy;
					_device_battery_values_tmp.energy_empty = v.energy_empty;
					_device_battery_values_tmp.energy_designed_full =
						v.energy_designed_full;
					_device_battery_values_tmp.energy_full = v.energy_full;
					_device_battery_values_tmp.charge_cycles_remaining =
						v.charge_cycles_remaining;
					_device_battery_values_tmp.charge_cycles_designed =
						v.charge_cycles_designed;
					_device_battery_values_tmp.charge_cycles = v.charge_cycles;
					_device_battery_values_tmp.static_voltage =
						v.static_voltage;
					_device_battery_values_tmp.dynamic_voltage =
						v.dynamic_voltage;
					_device_battery_values_tmp.resistance = v.resistance;
					_device_battery_values_tmp.current_discharge_time =
						v.current_discharge_time;
					_device_battery_values_tmp.capacity = v.capacity;
					_device_battery_values_tmp.technology = v.technology;
					_device_battery_values_tmp.created_on = v.created_on;
					result.push(_device_battery_values_tmp);
				});
			});
		} catch (error) {
			throw error;
		}
		return result;
	}

	async getDeviceNetworkValuesHistory(
		_input_req: DeviceNetworkValues,
		from_date: Date,
		to_date: Date
	) {
		var result: Array<DeviceNetworkValues> = new Array<DeviceNetworkValues>();
		try {
			await using(this.db.getDisposablePool(), async (pool) => {
				const client: ConnectionPool = await pool.connect();
				const transaction: Transaction = pool.getTransaction(client);
				await transaction.begin();
				var result_temp: IResult<any> = await pool
					.getRequest(transaction)
					.input(
						"device_id",
						this.db.TYPES.VarChar,
						_input_req.device_id
					)
					.input(
						"from_date_time",
						this.db.TYPES.DateTimeOffset,
						from_date
					)
					.input(
						"to_date_time",
						this.db.TYPES.DateTimeOffset,
						to_date
					)
					.query(this.sql_get_device_network_values);
				/* if (_input_req.idh_session_id > 0) {
					qb.addParameter(
						"idh_session_id",
						_input_req.idh_session_id,
						"="
					);
				} */
				if (_.has(result_temp, "recordset.0")) {
					_.forEach(result_temp.recordset, (v) => {
						var _device_network_values_tmp = new DeviceNetworkValues();
						_device_network_values_tmp.device_id = parseInt(
							v.device_id
						);
						_device_network_values_tmp.idh_session_id = parseInt(
							v.idh_session_id
						);
						_device_network_values_tmp.device_id = parseInt(
							v.device_id
						);
						_device_network_values_tmp.created_on = v.created_on;
						_device_network_values_tmp.network_info =
							v.network_info;
						result.push(_device_network_values_tmp);
					});
				}
				await transaction.commit();
			});
		} catch (error) {
			throw error;
		}
		return result;
	}
}
