import { DeviceModel } from "../../../models/device.model";
import * as _ from "lodash";
export class DeviceDatasetModel extends DeviceModel {
  device_id: number = 0;
  constructor(init?: Partial<DeviceDatasetModel>) {
    super(init);
    if (init) {
      if (typeof init.device_id == "number") this.device_id = init.device_id;
    }
  }
}
export class DeviceWithIDHDatasetModel extends DeviceDatasetModel {
  idh_id: number = 0;
  idh_device_name: string = "";
  idh_device_type: string = "";
  idh_last_seen: Date | null = null;
  idh_hardware_version: string = "";
  idh_software_version: string = "";
  idh_communication_mode: string = "";
  idh_ip_address: string = "";
  idh_mac_address: string = "";
  idh_serial_no: string = "";
  idh_barcode: string = "";
  idh_facility: string = "";
  idh_tags: string = "";
  idh_physical_location: string = "";
  idh_attributes?: any;
  idh_created_by: number = 0;
  idh_modified_by: number = 0;
  idh_created_on: Date | null = null;
  idh_modified_on: Date | null = null;
  idh_is_active: boolean = true;
  idh_is_factory: boolean = false;

  constructor(init?: Partial<DeviceWithIDHDatasetModel>) {
    super(init);
    if (init) {
      if (typeof init.idh_id == "number") this.idh_id = init.idh_id;
      if (typeof init.idh_device_name == "string")
        this.idh_device_name = init.idh_device_name;
      if (typeof init.idh_device_type == "string")
        this.idh_device_type = init.idh_device_type;
      if (
        init.idh_last_seen instanceof Date ||
        typeof init.idh_last_seen == "string"
      )
        this.idh_last_seen = new Date(init.idh_last_seen);

      if (typeof init.idh_hardware_version == "string")
        this.idh_hardware_version = init.idh_hardware_version;
      if (typeof init.idh_software_version == "string")
        this.idh_software_version = init.idh_software_version;
      if (typeof init.idh_communication_mode == "string")
        this.idh_communication_mode = init.idh_communication_mode;
      if (typeof init.idh_ip_address == "string")
        this.idh_ip_address = init.idh_ip_address;
      if (typeof init.idh_mac_address == "string")
        this.idh_mac_address = init.idh_mac_address;
      if (typeof init.idh_serial_no == "string")
        this.idh_serial_no = init.idh_serial_no;
      if (typeof init.idh_barcode == "string")
        this.idh_barcode = init.idh_barcode;
      if (typeof init.idh_facility == "string")
        this.idh_facility = init.idh_facility;
      if (typeof init.idh_tags == "string") this.idh_tags = init.idh_tags;
      if (typeof init.idh_physical_location == "string")
        this.idh_physical_location = init.idh_physical_location;
      if (_.get(init, "idh_attributes", null) != null) {
        if (typeof init.idh_attributes == "string") {
          try {
            this.idh_attributes = JSON.parse(init.idh_attributes);
          } catch (error) {
            this.idh_attributes = {};
          }
        } else {
          this.idh_attributes = init.idh_attributes;
        }
      }
      //
      if (typeof init.idh_created_by == "number")
        this.idh_created_by = init.idh_created_by;
      if (typeof init.idh_modified_by == "number")
        this.idh_modified_by = init.idh_modified_by;
      if (typeof init.idh_is_active == "boolean")
        this.idh_is_active = init.idh_is_active;
      if (
        init.idh_created_on instanceof Date ||
        typeof init.idh_created_on == "string"
      )
        this.idh_created_on = new Date(init.idh_created_on);
      if (
        init.idh_modified_on instanceof Date ||
        typeof init.idh_modified_on == "string"
      )
        this.idh_modified_on = new Date(init.idh_modified_on);
    }
  }
}
