import { using, Environment } from "../../global/utils";
import { BaseService } from "./base.service";
import * as _ from "lodash";
import { ErrorResponse } from "../../global/models/errorres.model";
import { ConnectionPool, Transaction, IResult } from "mssql";
import * as uuid from "uuid";
import {
	DeviceModel,
	DeviceModelCriteria,
	DeviceSoftwareVersion,
	DeviceSoftwareVersionCriteria,
} from "../models/device.model";
import { AppSettingsService } from "./appsettings.service";
import { AppSettingsModel } from "../models/appsettings.model";
import moment from "moment";
import { PeopleModel } from "../models/people.model";
import { json_custom_parser } from "../../global/utils/jsoncustomparser";
import { InventoryStatusModel } from "../models/inventorystatus.model";
export class DeviceService extends BaseService {
	constructor() {
		super();
		this.environment = new Environment();
	}
	environment: Environment;
	sql_update: string = `
	BEGIN

	DECLARE @temp table ( 
		old_inventory_status_id TINYINT,
		new_inventory_status_id TINYINT,
		old_software_version [varchar](32),
		new_software_version [varchar](32)
		);
	DECLARE @old_inventory_status_id TINYINT = 0, @new_inventory_status_id TINYINT = 0;
	DECLARE @old_software_version [varchar](32) = null, @new_software_version [varchar](32) = null;

	UPDATE tbldevice
	set [device_name] = @device_name
		,[device_type] = @device_type
		,[driver_name] = @driver_name
		,[last_seen] = @last_seen
		,[hardware_version] = @hardware_version
		,[software_version] = @software_version
		,[communication_mode] = @communication_mode
		,[ip_address] = @ip_address
		,[mac_address] = @mac_address
		,[serial_no] = @serial_no
		,[is_disposable] = @is_disposable
		,[is_commissioned] = @is_commissioned
		,[barcode] = @barcode
		,[facility] = @facility
		,[room] = @room
		,[ward] = @ward
		,[tags] = @tags
		,[physical_location] = @physical_location
		,[attributes] = @attributes
		,[created_by] = @created_by
		,[modified_by] = @modified_by
		,[created_on] = @created_on
		,[modified_on] = @modified_on
		,[is_active] = @is_active
		,[is_suspended] = @is_suspended
		,[parent_id] = @parent_id
		,[is_factory] = @is_factory
		,[notes] = @notes
		,[inventory_status_id] = @inventory_status_id
	OUTPUT 
		DELETED.inventory_status_id as old_inventory_status_id,
		INSERTED.inventory_status_id as new_inventory_status_id,
		DELETED.software_version as old_software_version,
		INSERTED.software_version as new_software_version
		into @temp
	WHERE 
		id = @id;

	select 
		@old_inventory_status_id = old_inventory_status_id,
		@new_inventory_status_id = new_inventory_status_id,
		@old_software_version = old_software_version,
		@new_software_version = new_software_version
	from @temp;

	IF @old_inventory_status_id <> @new_inventory_status_id
	BEGIN
		INSERT INTO [tbldeviceinventorystatus]
		(	[device_id]
           ,[inventory_status_id]
           ,[created_by]
           ,[modified_by]
           ,[created_on]
           ,[modified_on]
           ,[is_active]
        )
		VALUES
        (	@id
           ,@old_inventory_status_id
           ,@created_by
           ,@modified_by
           ,@modified_on
           ,@modified_on
           ,1
        )
	END

	IF @old_software_version <> @new_software_version
	BEGIN
		INSERT INTO [dbo].[tblDeviceSoftwareVersion]
        (	[device_id]
           ,[software_version]
           ,[created_by]
           ,[modified_by]
           ,[created_on]
           ,[modified_on]
           ,[is_active]
		)
     	VALUES
        (	@id
           ,@old_software_version
           ,@created_by
           ,@modified_by
           ,@modified_on
           ,@modified_on
           ,1
        )
	END

	SELECT * FROM tblDevice WHERE id = @id;

	END
	`;
	sql_save: string = `
	INSERT INTO [tblDevice]
			([device_name]
			,[device_type]
			,[driver_name]
			,[last_seen]
			,[hardware_version]
			,[software_version]
			,[communication_mode]
			,[ip_address]
			,[mac_address]
			,[serial_no]
			,[is_disposable]
			,[barcode]
			,[facility]
			,[room]
			,[ward]
			,[tags]
			,[physical_location]
			,[attributes]
			,[is_commissioned]
			,[inventory_status_id]
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
			(@device_name,
			@device_type,
			@driver_name,
			@last_seen, 
			@hardware_version,
			@software_version,
			@communication_mode,
			@ip_address,
			@mac_address,
			@serial_no,
			@is_disposable,
			@barcode,
			@facility,
			@room,
			@ward,
			@tags,
			@physical_location,
			@attributes,
			@is_commissioned,
			@inventory_status_id,
			@created_by,
			@modified_by,
			@created_on, 
			@modified_on, 
			@is_active,
			@is_suspended,
			@parent_id,
			@is_factory,
			@notes)
	`;
	sql_get: string = `
	SELECT td.[id]
		, [td].[device_name]
		, [td].[device_type]
		, [td].[driver_name]
		, [td].[last_seen]
		, [td].[hardware_version]
		, [td].[software_version]
		, [td].[communication_mode]
		, [td].[ip_address]
		, [td].[mac_address]
		, [td].[serial_no]
		, [td].[is_disposable]
		, [td].[barcode]
		, [td].[facility]
		, [td].[room]
		, [td].[ward]
		, [td].[tags]
		, [td].[physical_location]
		, [td].[attributes]
		, [td].[is_commissioned]
		, [td].[inventory_status_id]
		, [td].[created_by]
		, [td].[modified_by]
		, [td].[created_on]
		, [td].[modified_on]
		, [td].[is_active]
		, [td].[is_suspended]
		, [td].[parent_id]
		, [td].[is_factory]
		, [td].[notes]
		, [tis].[inventory_status_key]
		, [tis].[inventory_status_text] 
		, [tis].[is_factory] [inventory_status_is_factory]
		, total_count = COUNT(*) OVER()
	FROM [tblDevice] td
	LEFT JOIN tblInventoryStatus tis on tis.id = td.inventory_status_id 
	`;
	sql_get_with_pagination: string = `
	SELECT td.[id]
		, [td].[device_name]
		, [td].[device_type]
		, [td].[driver_name]
		, [td].[last_seen]
		, [td].[hardware_version]
		, [td].[software_version]
		, [td].[communication_mode]
		, [td].[ip_address]
		, [td].[mac_address]
		, [td].[serial_no]
		, [td].[is_disposable]
		, [td].[barcode]
		, [td].[facility]
		, [td].[room]
		, [td].[ward]
		, [td].[tags]
		, [td].[physical_location]
		, [td].[attributes]
		, [td].[is_commissioned]
		, [td].[inventory_status_id]
		, [td].[created_by]
		, [td].[modified_by]
		, [td].[created_on]
		, [td].[modified_on]
		, [td].[is_active]
		, [td].[is_suspended]
		, [td].[parent_id]
		, [td].[is_factory]
		, [td].[notes]
		, [tis].[inventory_status_key]
		, [tis].[inventory_status_text] 
		, total_count = COUNT(*) OVER()
	FROM [tblDevice] td
	LEFT JOIN tblInventoryStatus tis on tis.id = td.inventory_status_id 
	@condition
	order by id desc
	offset @skip rows
	fetch next @size rows only
	`;
	sql_insert: string = ``;
	sql_get_distinct_device_type: string = `SELECT DISTINCT device_type FROM tblDevice 
	WHERE device_type <> 'IDH'`;
	sql_get_dashboard = `
		-- DECLARE @p_device_type varchar(32), @p_serial_no varchar(50), @p_from_date datetime, @p_to_date datetime, @device_id bigint
		-- SELECT @p_device_type = '', @p_serial_no = '', @p_from_date = null, @p_to_date = null
		IF (@p_device_type = '') SET @p_device_type = null
IF (@p_serial_no = '') SET @p_serial_no = null
		DECLARE @max_last_seen DATETIME, @max_session_device_created_on DATETIME
		IF OBJECT_ID('tempdb..#device_view') IS NOT NULL
			DROP TABLE #device_view
		CREATE TABLE #device_view (id SMALLINT IDENTITY(1,1), device_id BIGINT, device_name VARCHAR(50), 
		device_type VARCHAR(30), last_seen DATETIME, serial_no VARCHAR(50), barcode VARCHAR(50), 
		hardware_version varchar(32), software_version varchar(32), communication_mode varchar(32), 
		ip_address VARCHAR(200), mac_address VARCHAR(200), idh_session_id BIGINT,
		facility nVARCHAR(mx), physical_location VARCHAR(40),  attributes VARCHAR(4000),
		battery_capacity varchar(50), network_signal smallint DEFAULT 0)

		DECLARE @last_data_received_dttm datetime, @query varchar(4000), @date_condition_query varchar(2000), @drill_down bit 
		SELECT @last_data_received_dttm = MAX(last_seen) from tblDevice where is_active = 1
		IF (@p_device_type IS NOT NULL OR @p_serial_no IS NOT NULL)
		BEGIN
			IF (@p_device_type = 'IDH')
			BEGIN
				SET @drill_down = 1
				SELECT @query = '
				SELECT TOP 20 tblDevice.id, tblDevice.device_name, tblDevice.device_type, 
				tblDevice.last_seen, tbldevice.serial_no, barcode, hardware_version, software_version, communication_mode,
				ip_address, mac_address, facility, tblIDHSessions.id
				FROM tblDevice, tblIDHSessions WHERE tblIDHSessions.device_id = tblDevice.id
				AND tblDevice.device_type = ''IDH'''
			END
			ELSE
			BEGIN
				SELECT @query = '
				SELECT DISTINCT TOP 20 tblDevice.id, tblDevice.device_name, tblDevice.device_type, 
				tblDevice.last_seen, tbldevice.serial_no, barcode, hardware_version, software_version, communication_mode,
				ip_address, mac_address, facility, tblSessionDevices.idh_session_id
				FROM tblDevice, tblSessionDevices
				WHERE tblSessionDevices.device_id = tblDevice.id'
			END
			IF (@p_serial_no IS NOT NULL AND DATALENGTH(@p_serial_no) > 0)
			BEGIN
				SELECT @query = @query + ' AND tblDevice.serial_no = ''' + @p_serial_no + ''''
			END
			/* IF (@p_device_type IS NOT NULL AND DATALENGTH(@p_device_type) > 0)
			BEGIN
				SELECT @query = @query + ' AND tblDevice.device_type = ''' + @p_device_type + ''''
			END */
			IF (@p_from_date IS NOT NULL AND @p_to_date IS NOT NULL)
			BEGIN
				SELECT @date_condition_query = ' AND tblDevice.last_seen BETWEEN ''' + CONVERT(VARCHAR(20), @p_from_date)
				+ ''' AND ''' + CONVERT(VARCHAR(20), @p_to_date) + ''''
				-- SELECT @query = @query + @date_condition_query
			END
			PRINT @query
			INSERT #device_view (device_id, device_name, device_type, last_seen, serial_no, barcode, hardware_version, 
			software_version, communication_mode, ip_address, mac_address, facility, idh_session_id)
			EXEC (@query + @date_condition_query)
			
			IF (SELECT COUNT(1) FROM #device_view) = 0
			BEGIN
				IF (@p_device_type = 'IDH')
				BEGIN
					SELECT @max_session_device_created_on = MAX(Created_on) FROM tblSessionDevices WHERE is_Active = 1

					SELECT @query = @query + 'AND tblIDHSessions.id in (SELECT idh_session_id FROM tblSessionDevices WHERE is_active = 1 AND
					tblSessionDevices.created_on BETWEEN
					DATEADD(MINUTE, -60, ''' + CONVERT(VARCHAR(20), @max_session_device_created_on) + ''') AND ''' + 
					CONVERT(VARCHAR(20), @max_session_device_created_on) + ''')' 
				END
				ELSE
				BEGIN
					SELECT @max_last_seen = MAX(last_seen) FROM tblDevice , tblIDHSessions
					WHERE tblIDHSessions.device_id = tblDevice.id and tblIDHSessions.is_active = 1

					SELECT @query = @query + 'AND tblDevice.last_seen BETWEEN 
					DATEADD(MINUTE, -15, ''' + CONVERT(VARCHAR(20), @max_last_seen) + ''') AND ''' + CONVERT(VARCHAR(20), @max_last_seen) + ''''
				END
				PRINT @query
				INSERT #device_view (device_id, device_name, device_type, last_seen, serial_no, barcode, hardware_version, 
				software_version, communication_mode, ip_address, mac_address, facility, idh_session_id)
				EXEC (@query)
			END
		END
		ELSE
		BEGIN
			SET @drill_down = 1
			INSERT #device_view (device_id, device_name, device_type, last_seen, serial_no, barcode, hardware_version, 
			software_version, communication_mode, ip_address, mac_address, facility, physical_location, idh_session_id, attributes)
			SELECT TOP 20 tblDevice.id, tblDevice.device_name, tblDevice.device_type, 
			tblDevice.last_seen, tbldevice.serial_no, barcode, hardware_version, software_version, communication_mode,
			ip_address, mac_address, facility, physical_location, tblIDHSessions.id, tblDevice.attributes
			FROM tblDevice, tblIDHSessions
			WHERE tblIDHSessions.device_id = tblDevice.id and tblIDHSessions.is_active = 1
			AND tblDevice.last_seen BETWEEN @p_from_date AND @p_to_date
			-- AND tblDevice.last_seen BETWEEN DATEADD(day, -5, @last_data_received_dttm) AND @last_data_received_dttm
			
			IF (SELECT COUNT(1) FROM #device_view) = 0
			BEGIN
				-- DECLARE @max_last_seen DATETIME
				SELECT @max_last_seen = MAX(last_seen) FROM tblDevice, tblIDHSessions
				WHERE tblIDHSessions.device_id = tblDevice.id and tblIDHSessions.is_active = 1
				-- select @max_last_seen, DATEADD(HOUR, -2, @max_last_seen)
				INSERT #device_view (device_id, device_name, device_type, last_seen, serial_no, barcode, hardware_version, 
				software_version, communication_mode, ip_address, mac_address, facility, physical_location, idh_session_id, attributes)
				SELECT TOP 20 tblDevice.id, tblDevice.device_name, tblDevice.device_type, 
				tblDevice.last_seen, tbldevice.serial_no, barcode, hardware_version, software_version, communication_mode,
				ip_address, mac_address, facility, physical_location, tblIDHSessions.id, tblDevice.attributes
				FROM tblDevice, tblIDHSessions
				WHERE tblIDHSessions.device_id = tblDevice.id and tblIDHSessions.is_active = 1
				AND tblDevice.last_seen BETWEEN DATEADD(MINUTE, -30, @max_last_seen) AND @max_last_seen 
			END
		END
		--Select count(1) from #device_view
		--return

		DECLARE @loop_count SMALLINT = 1, @tmp_rec_count SMALLINT, @device_id_tmp BIGINT, @idh_session_id_tmp BIGINT
		IF (@drill_down = 1)
		BEGIN
			SELECT @tmp_rec_count = count(1) FROM #device_view
			WHILE (@loop_count <= @tmp_rec_count)
			BEGIN
				SELECT @device_id_tmp = device_id, @idh_session_id_tmp = idh_session_id FROM #device_view WHERE id = @loop_count
		
				/* SELECT @idh_session_id_tmp = MAX(idh_session_id) FROM tblIDHSessions, tblSessionDevices
				WHERE tblIDHSessions.device_id = @device_id_tmp AND tblIDHSessions.id = tblSessionDevices.idh_session_id
				AND tblIDHSessions.is_active = 1
		
				UPDATE #device_view SET idh_session_id = @idh_session_id_tmp WHERE id = @loop_count AND device_id = @device_id_tmp */
		
				IF EXISTS (SELECT 1 FROM tblSessionDevices WHERE idh_session_id = @idh_session_id_tmp)
				BEGIN
					INSERT #device_view (device_id, device_name, device_type, last_seen, serial_no, barcode, 
					hardware_version, software_version, communication_mode, ip_address, mac_address, idh_session_id,
					facility, physical_location, attributes)
					SELECT DISTINCT tblDevice.id, tblDevice.device_name, tblDevice.device_type, 
					tblDevice.last_seen, tbldevice.serial_no, barcode, hardware_version, software_version, communication_mode,
					ip_address, mac_address, @idh_session_id_tmp, facility, physical_location, tblDevice.attributes
					FROM tblDevice, tblSessionDevices
					WHERE tblSessionDevices.device_id = tblDevice.id 
					AND tblSessionDevices.idh_session_id = @idh_session_id_tmp
				END
				SET @loop_count = @loop_count + 1
			END

			UPDATE tmp SET battery_capacity = capacity FROM tblSessionDeviceBattery battery, #device_view tmp
			WHERE tmp.device_id = battery.device_id AND tmp.idh_session_id = battery.idh_session_id AND battery.is_active = 1 
			
			UPDATE tmp SET network_signal = convert(smallint, isnull(network.interface_value, 0))
			FROM tblDeviceNetworkConfig network INNER JOIN #device_view tmp
			ON tmp.device_id = network.device_id AND tmp.idh_session_id = network.idh_session_id 
			WHERE network.interface_name = 'mlan0|dbm' AND network.is_active = 1 
		END

		SELECT * FROM #device_view ORDER BY id DESC
	`;
	sql_get_device_software_version = `
	SELECT [dsv].[id]
		,[dsv].[device_id]
		,[dsv].[idh_session_id]
		,[dsv].[software_version]
		,[dsv].[created_by]
		,[dsv].[modified_by]
		,[dsv].[created_on]
		,[dsv].[modified_on]
		,[dsv].[is_active]
		,[dsv].[is_suspended]
		,[dsv].[parent_id]
		,[dsv].[is_factory]
		,[dsv].[notes]
		,[p].[external_id] [people_external_id]
		,[p].[first_name] [people_first_name]
	FROM [tblDeviceSoftwareVersion] [dsv]
	LEFT JOIN [tblPeople] [p] on [p].[id] = [dsv].[created_by]
	WHERE [dsv].[device_id] = @device_id
	AND [dsv].[created_on] between @from_date and @to_date
	ORDER BY [dsv].[created_on] DESC
	`;
	async dashboard(_device: DeviceModelCriteria) {
		var result: Array<DeviceModel> = new Array<DeviceModel>();
		try {
			if (_device.from_date == null && _device.to_date == null) {
				var appsettings_service = new AppSettingsService();
				var settings: AppSettingsModel = await appsettings_service.getSettings(
					AppSettingsModel.types.LSL_PAGES
				);
				var page: any = _.find(settings.value.pages, (v) => {
					return v.key == "ACTIVE_DEVICES";
				});
				if (_.has(page, "date_range.value")) {
					_device.to_date = new Date();
					_device.from_date = moment(_device.to_date)
						.subtract(page.date_range.value, page.date_range.unit)
						.toDate();
				} else {
					_device.to_date = new Date();
					_device.from_date = new Date();
				}
			}
			await using(this.db.getDisposablePool(), async (pool) => {
				var client = await pool.connect();
				var result_temp: IResult<any> = await pool
					.getRequest(client)
					.input(
						"p_device_type",
						this.db.TYPES.VarChar,
						_device.device_type
					)
					.input(
						"p_serial_no",
						this.db.TYPES.VarChar,
						_device.serial_no
					)
					.input(
						"p_from_date",
						this.db.TYPES.DateTime,
						_device.from_date
					)
					.input("p_to_date", this.db.TYPES.DateTime, _device.to_date)
					.query(this.sql_get_dashboard);
				// var query_string = qb.getQuery();
				// var { recordset }: IResult<any> = await client.query();
				if (_.has(result_temp, "recordset.0")) {
					_.forEach(result_temp.recordset, (v) => {
						var _device_tmp = new DeviceModel(v);
						_device_tmp.id = parseInt(v.device_id);
						_device_tmp.device_name = v.device_name;
						_device_tmp.device_type = v.device_type;
						_device_tmp.serial_no = v.serial_no;
						_device_tmp.barcode = v.barcode;
						_device_tmp.battery_capacity = v.battery_capacity;
						_device_tmp.hardware_version = v.hardware_version;
						_device_tmp.software_version = v.software_version;
						_device_tmp.ip_address = v.ip_address;
						_device_tmp.mac_address = v.mac_address;
						_device_tmp.last_seen = v.last_seen
							? new Date(v.last_seen)
							: v.last_seen;
						_device_tmp.idh_session_id = v.idh_session_id
							? parseInt(v.idh_session_id)
							: 0;
						_device_tmp.network_signal = parseInt(v.network_signal);
						result.push(_device_tmp);
					});
				}
			});
		} catch (error) {
			throw error;
		}
		return result;
	}

	async getDistinctDeviceTypes() {
		var result: Array<string> = new Array<string>();
		try {
			await using(this.db.getDisposablePool(), async (pool) => {
				var client = await pool.connect();
				var qb = new this.utils.QueryBuilder(
					this.sql_get_distinct_device_type
				);
				var query_string = qb.getQuery();
				var { recordset }: IResult<any> = await client.query(
					query_string
				);

				_.forEach(recordset, (v) => {
					result.push(v.device_type);
				});
			});
		} catch (error) {
			throw error;
		}
		return result;
	}
	async get(
		_device: DeviceModelCriteria
	): Promise<Array<DeviceModelCriteria>> {
		var result: Array<DeviceModelCriteria> = new Array<DeviceModelCriteria>();
		try {
			await using(this.db.getDisposablePool(), async (pool) => {
				var client = await pool.connect();
				var qb = new this.utils.QueryBuilder(this.sql_get);
				if (_device.device_type != "") {
					qb.addParameter("td.device_type", _device.device_type, "=");
				}
				if (_device.id > 0) {
					qb.addParameter("td.id", _device.id, "=");
				}
				if (_device.serial_no != "") {
					qb.addParameter("td.serial_no", _device.serial_no, "=");
				}
				var query_string = qb.getQuery();
				var { recordset }: IResult<any> = await client.query(
					query_string
				);
				if (recordset.length > 0) {
					_.forEach(recordset, (v) => {
						var device_temp = new DeviceModelCriteria(v);
						device_temp.id = parseInt(v.id);
						device_temp.created_by = parseInt(v.created_by);
						device_temp.modified_by = parseInt(v.modified_by);
						device_temp.attributes = new DeviceModel.Attributes(
							json_custom_parser.parse(
								v.attributes,
								new DeviceModel.Attributes()
							)
						);
						device_temp.inventory_status = new InventoryStatusModel(
							{
								id: v.inventory_status_id,
								inventory_status_key: v.inventory_status_key,
								inventory_status_text: v.inventory_status_text,
								is_factory: v.inventory_status_is_factory,
							}
						);
						result.push(device_temp);
					});
				}
			});
		} catch (error) {
			throw error;
		}
		return result;
	}
	async getWithPagination(
		_device: DeviceModelCriteria,
		page: number,
		size: number
	): Promise<{ items: Array<DeviceModelCriteria>; total_count: number }> {
		var result: {
			items: Array<DeviceModelCriteria>;
			total_count: number;
		} = {
			items: [],
			total_count: 0,
		};
		try {
			await using(this.db.getDisposablePool(), async (pool) => {
				var client = await pool.connect();
				var query = this.sql_get_with_pagination;
				var condition_array: Array<any> = [];
				if (_device.device_name.trim().length > 0) {
					condition_array.push(
						`[td].device_name like '%${_device.device_name}%'`
					);
				}
				if (_device.device_type.trim().length > 0) {
					condition_array.push(
						`[td].device_type like '%${_device.device_type}%'`
					);
				}
				if (_device.serial_no.trim().length > 0) {
					condition_array.push(
						`[td].serial_no like '%${_device.serial_no}%'`
					);
				}
				if (
					_device.inventory_status.inventory_status_key.trim()
						.length > 0
				) {
					condition_array.push(
						`[tis].inventory_status_key like '%${_device.inventory_status.inventory_status_key}%'`
					);
				}
				condition_array.push(
					`[td].is_commissioned = '${_device.is_commissioned}'`
				);
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
						var device_temp = new DeviceModelCriteria(v);
						device_temp.id = parseInt(v.id);
						device_temp.created_by = parseInt(v.created_by);
						device_temp.modified_by = parseInt(v.modified_by);
						device_temp.attributes = new DeviceModel.Attributes(
							json_custom_parser.parse(v.attributes, null)
						);
						device_temp.inventory_status = new InventoryStatusModel(
							{
								id: v.inventory_status_id,
								inventory_status_key: v.inventory_status_key,
								inventory_status_text: v.inventory_status_text,
							}
						);
						result.items.push(device_temp);
					});
					result.total_count = recordset[0].total_count;
				}
			});
		} catch (error) {
			throw error;
		}
		return result;
	}
	async save(_device: DeviceModel): Promise<DeviceModel> {
		var result: DeviceModel = new DeviceModel();
		try {
			await using(this.db.getDisposablePool(), async (pool) => {
				const client: ConnectionPool = await pool.connect();
				const transaction: Transaction = pool.getTransaction(client);
				try {
					await transaction.begin();
					var result_temp: IResult<any> = await pool
						.getRequest(transaction)
						.input(
							"device_name",
							this.db.TYPES.VarChar,
							_device.device_name
						)
						.input(
							"device_type",
							this.db.TYPES.VarChar,
							_device.device_type
						)
						.input(
							"driver_name",
							this.db.TYPES.VarChar,
							_device.driver_name
						)
						.input(
							"last_seen",
							this.db.TYPES.DateTime,
							_device.last_seen
						)
						.input(
							"hardware_version",
							this.db.TYPES.VarChar,
							_device.hardware_version
						)
						.input(
							"software_version",
							this.db.TYPES.VarChar,
							_device.software_version
						)
						.input(
							"communication_mode",
							this.db.TYPES.VarChar,
							_device.communication_mode
						)
						.input(
							"ip_address",
							this.db.TYPES.VarChar,
							_device.ip_address
						)
						.input(
							"mac_address",
							this.db.TYPES.VarChar,
							_device.mac_address
						)
						.input(
							"serial_no",
							this.db.TYPES.VarChar,
							_device.serial_no
						)
						.input(
							"is_disposable",
							this.db.TYPES.Bit,
							_device.is_disposable ? 1 : 0
						)
						.input(
							"barcode",
							this.db.TYPES.VarChar,
							_device.barcode
						)
						.input(
							"facility",
							this.db.TYPES.NVarChar,
							JSON.stringify(_device.facility)
						)
						.input("room", this.db.TYPES.VarChar, _device.room)
						.input("ward", this.db.TYPES.VarChar, _device.ward)
						.input("tags", this.db.TYPES.VarChar, _device.tags)
						.input(
							"physical_location",
							this.db.TYPES.VarChar,
							_device.physical_location
						)
						.input(
							"attributes",
							this.db.TYPES.VarChar,
							JSON.stringify(_device.attributes)
						)
						.input(
							"is_commissioned",
							this.db.TYPES.Bit,
							_device.is_commissioned ? 1 : 0
						)
						.input(
							"inventory_status_id",
							this.db.TYPES.TinyInt,
							_device.inventory_status_id
						)
						.input(
							"created_by",
							this.db.TYPES.BigInt,
							_device.created_by
						)
						.input(
							"modified_by",
							this.db.TYPES.BigInt,
							_device.modified_by
						)
						.input("created_on", this.db.TYPES.DateTime, new Date())
						.input(
							"modified_on",
							this.db.TYPES.DateTime,
							new Date()
						)
						.input("is_active", this.db.TYPES.Bit, true)
						.input(
							"is_suspended",
							this.db.TYPES.Bit,
							_device.is_suspended
						)
						.input(
							"parent_id",
							this.db.TYPES.SmallInt,
							_device.parent_id
						)
						.input(
							"is_factory",
							this.db.TYPES.Bit,
							_device.is_factory
						)
						.input("notes", this.db.TYPES.VarChar, _device.notes)
						.query(this.sql_save);
					if (_.has(result_temp, "recordset.0")) {
						var record = result_temp.recordset[0];
						result = new DeviceModel(record);
						result.id = parseInt(record.id);
						result.inventory_status_id = parseInt(
							record.inventory_status_id
						);
						result.created_by = parseInt(record.created_by);
						result.modified_by = parseInt(record.modified_by);
						result.attributes = new DeviceModel.Attributes(
							json_custom_parser.parse(
								record.attributes,
								new DeviceModel.Attributes()
							)
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
	async saveBulk(
		_device_list: Array<DeviceModelCriteria>,
		user_id: number = 0
	) {
		try {
			for (var i = 0, length = _device_list.length; i < length; i++) {
				var device_temp:
					| DeviceModel
					| DeviceModelCriteria = await this.save(
					new DeviceModel({ ..._device_list[i], created_by: user_id })
				).catch((error) => {
					_device_list[i].error = JSON.stringify(error);
					return _device_list[i];
				});
				_device_list[i] = new DeviceModelCriteria(device_temp);
			}
		} catch (error) {
			throw error;
		}
		return _device_list;
	}
	async update(_device: DeviceModel): Promise<DeviceModel> {
		var result: DeviceModel = new DeviceModel();
		try {
			await using(this.db.getDisposablePool(), async (pool) => {
				const client: ConnectionPool = await pool.connect();
				const transaction: Transaction = pool.getTransaction(client);
				try {
					await transaction.begin();
					var result_temp: IResult<any> = await pool
						.getRequest(transaction)
						.input("id", this.db.TYPES.BigInt, _device.id)
						.input(
							"device_name",
							this.db.TYPES.VarChar,
							_device.device_name
						)
						.input(
							"device_type",
							this.db.TYPES.VarChar,
							_device.device_type
						)
						.input(
							"driver_name",
							this.db.TYPES.VarChar,
							_device.driver_name
						)
						.input(
							"last_seen",
							this.db.TYPES.DateTime,
							_device.last_seen
						)
						.input(
							"hardware_version",
							this.db.TYPES.VarChar,
							_device.hardware_version
						)
						.input(
							"software_version",
							this.db.TYPES.VarChar,
							_device.software_version
						)
						.input(
							"communication_mode",
							this.db.TYPES.VarChar,
							_device.communication_mode
						)
						.input(
							"ip_address",
							this.db.TYPES.VarChar,
							_device.ip_address
						)
						.input(
							"mac_address",
							this.db.TYPES.VarChar,
							_device.mac_address
						)
						.input(
							"serial_no",
							this.db.TYPES.VarChar,
							_device.serial_no
						)
						.input(
							"is_disposable",
							this.db.TYPES.Bit,
							_device.is_disposable ? 1 : 0
						)
						.input(
							"barcode",
							this.db.TYPES.VarChar,
							_device.barcode
						)
						.input(
							"facility",
							this.db.TYPES.NVarChar,
							JSON.stringify(_device.facility)
						)
						.input("room", this.db.TYPES.VarChar, _device.room)
						.input("ward", this.db.TYPES.VarChar, _device.ward)
						.input("tags", this.db.TYPES.VarChar, _device.tags)
						.input(
							"physical_location",
							this.db.TYPES.VarChar,
							_device.physical_location
						)
						.input(
							"attributes",
							this.db.TYPES.VarChar,
							JSON.stringify(_device.attributes)
						)
						.input(
							"is_commissioned",
							this.db.TYPES.Bit,
							_device.is_commissioned ? 1 : 0
						)
						.input(
							"inventory_status_id",
							this.db.TYPES.TinyInt,
							_device.inventory_status_id
						)
						.input(
							"created_by",
							this.db.TYPES.BigInt,
							_device.created_by
						)
						.input(
							"modified_by",
							this.db.TYPES.BigInt,
							_device.modified_by
						)
						.input(
							"created_on",
							this.db.TYPES.DateTime,
							_device.created_on
						)
						.input(
							"modified_on",
							this.db.TYPES.DateTime,
							new Date()
						)
						.input("is_active", this.db.TYPES.Bit, true)
						.input(
							"is_suspended",
							this.db.TYPES.Bit,
							_device.is_suspended
						)
						.input(
							"parent_id",
							this.db.TYPES.SmallInt,
							_device.parent_id
						)
						.input(
							"is_factory",
							this.db.TYPES.Bit,
							_device.is_factory
						)
						.input("notes", this.db.TYPES.VarChar, _device.notes)
						.query(this.sql_update);
					if (_.has(result_temp, "recordset.0")) {
						var record = result_temp.recordset[0];
						result = new DeviceModel(record);
						result.id = parseInt(record.id);
						result.inventory_status_id = parseInt(
							record.inventory_status_id
						);
						result.created_by = parseInt(record.created_by);
						result.modified_by = parseInt(record.modified_by);
						result.attributes = new DeviceModel.Attributes(
							json_custom_parser.parse(
								record.attributes,
								new DeviceModel.Attributes()
							)
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
	async getDeviceSoftwareVersion(
		_req: DeviceSoftwareVersionCriteria
	): Promise<Array<DeviceSoftwareVersionCriteria>> {
		var result: Array<DeviceSoftwareVersionCriteria> = new Array<DeviceSoftwareVersionCriteria>();
		try {
			if (_req.from_date == null && _req.to_date == null) {
				var appsettings_service = new AppSettingsService();
				var settings: AppSettingsModel = await appsettings_service.getSettings(
					AppSettingsModel.types.LSL_PAGES
				);
				var page: any = _.find(settings.value.pages, (v) => {
					return v.key == "DEVICE_SOFTWARE_VERSION_HISTORY";
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
				var client = await pool.connect();
				var { recordset }: IResult<any> = await pool
					.getRequest(client)
					.input("device_id", this.db.TYPES.BigInt, _req.device_id)
					.input("from_date", this.db.TYPES.DateTime, _req.from_date)
					.input("to_date", this.db.TYPES.DateTime, _req.to_date)
					.query(this.sql_get_device_software_version);
				if (recordset.length > 0) {
					_.forEach(recordset, (v) => {
						var temp = new DeviceSoftwareVersionCriteria(v);
						temp.id = parseInt(v.id);
						temp.device_id = parseInt(v.device_id);
						temp.idh_session_id = parseInt(v.idh_session_id);
						temp.created_by = parseInt(v.created_by);
						temp.modified_by = parseInt(v.modified_by);
						temp.people = new PeopleModel({
							id: v.created_by,
							external_id: v.people_external_id,
							first_name: v.people_first_name,
						});
						result.push(temp);
					});
				}
			});
		} catch (error) {
			throw error;
		}
		return result;
	}
}
