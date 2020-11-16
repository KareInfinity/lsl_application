import * as _ from "lodash";
import { Base } from "./base.model";

export class DeviceBatteryValues extends Base {
  id: number = 0;
  idh_session_id: number = 0;
  device_id: number = 0;
  status: string = "";
  warning: string = "";
  activation_date: Date | null = null;
  expected_pm: Date | null = null;
  unique_id: string = "";
  temperature: string = "";
  serial_no: string = "";
  manufacturer_name: string = "";
  manufactured_date: string = "";
  current_energy: string = "";
  energy_empty: string = "";
  energy_designed_full: string = "";
  energy_full: string = "";
  charge_cycles_remaining: string = "";
  charge_cycles_designed: string = "";
  charge_cycles: string = "";
  static_voltage: string = "";
  dynamic_voltage: string = "";
  resistance: string = "";
  current_discharge_time: string = "";
  capacity: string = "";
  technology: string = "";
  /* template */
  created_by: number = 0;
  modified_by: number = 0;
  created_on: Date | null = null;
  modified_on: Date | null = null;
  is_active: boolean = true;
  is_factory: boolean = false;

  constructor(init?: Partial<DeviceBatteryValues>) {
    super(init);
    if (init) {
      if (typeof init.id == "number") this.id = init.id;
      if (typeof init.idh_session_id == "number")
        this.idh_session_id = init.idh_session_id;
      if (typeof init.device_id == "number") this.device_id = init.device_id;
      if (typeof init.status == "string") this.status = init.status;
      if (typeof init.warning == "string") this.warning = init.warning;
      if (
        init.activation_date instanceof Date ||
        typeof init.activation_date == "string"
      )
        this.activation_date = new Date(init.activation_date);
      if (
        init.expected_pm instanceof Date ||
        typeof init.expected_pm == "string"
      )
        this.expected_pm = new Date(init.expected_pm);
      if (typeof init.unique_id == "string") this.unique_id = init.unique_id;
      if (typeof init.temperature == "string")
        this.temperature = init.temperature;
      if (typeof init.serial_no == "string") this.serial_no = init.serial_no;
      if (typeof init.manufacturer_name == "string")
        this.manufacturer_name = init.manufacturer_name;
      if (typeof init.manufactured_date == "string")
        this.manufactured_date = init.manufactured_date;
      if (typeof init.current_energy == "string")
        this.current_energy = init.current_energy;
      if (typeof init.energy_empty == "string")
        this.energy_empty = init.energy_empty;
      if (typeof init.energy_designed_full == "string")
        this.energy_designed_full = init.energy_designed_full;
      if (typeof init.energy_full == "string")
        this.energy_full = init.energy_full;
      if (typeof init.charge_cycles_remaining == "string")
        this.charge_cycles_remaining = init.charge_cycles_remaining;
      if (typeof init.charge_cycles_designed == "string")
        this.charge_cycles_designed = init.charge_cycles_designed;
      if (typeof init.charge_cycles == "string")
        this.charge_cycles = init.charge_cycles;
      if (typeof init.static_voltage == "string")
        this.static_voltage = init.static_voltage;
      if (typeof init.dynamic_voltage == "string")
        this.dynamic_voltage = init.dynamic_voltage;
      if (typeof init.resistance == "string")
        this.resistance = init.resistance;
      if (typeof init.current_discharge_time == "string")
        this.current_discharge_time = init.current_discharge_time;
      if (typeof init.capacity == "string") this.capacity = init.capacity;
      if (typeof init.technology == "string")
        this.technology = init.technology;
      //
      if (typeof init.created_by == "number")
        this.created_by = init.created_by;
      if (typeof init.modified_by == "number")
        this.modified_by = init.modified_by;
      if (typeof init.is_active == "boolean") this.is_active = init.is_active;
      if (
        init.created_on instanceof Date ||
        typeof init.created_on == "string"
      )
        this.created_on = new Date(init.created_on);
      if (
        init.modified_on instanceof Date ||
        typeof init.modified_on == "string"
      )
        this.modified_on = new Date(init.modified_on);
    }
  }
}
export class DeviceBatteryValuesCriteria extends DeviceBatteryValues {
  from_date: Date | null = null;
  to_date: Date | null = null;
  constructor(init?: Partial<DeviceBatteryValuesCriteria>) {
    super(init);
    if (init) {
      if (init.from_date instanceof Date || typeof init.from_date == "string")
        this.from_date = new Date(init.from_date);
      if (init.to_date instanceof Date || typeof init.to_date == "string")
        this.to_date = new Date(init.to_date);
    }
  }
}
/* export class CustomDeviceBatteryValues extends Base {
	idh_session_id: number = 0;
	device_id: number = 0;
	raw_value: number = 0;
	raw_value_uom: string = "";
	created_on: Date | null = null;

	constructor(init?: Partial<CustomDeviceValues>) {
		super(init);
		if (typeof init.idh_session_id == "number") this.idh_session_id = init.idh_session_id;
		if (typeof init.device_id == "number") this.device_id = init.device_id;
		if (typeof init.raw_value == "number") this.raw_value = init.raw_value;
		if (typeof init.raw_value_uom == "string")
			this.raw_value_uom = init.raw_value_uom;
		if (
			init.created_on instanceof Date ||
			typeof init.created_on == "string"
		)
			this.created_on = new Date(init.created_on);
	}
} */
