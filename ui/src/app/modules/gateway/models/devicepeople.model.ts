import { Base } from "../../global/models/base.model";

export class DevicePeopleModel extends Base {
  id: number = 0;
  people_id: number = 0;
  device_id: number = 0;
  user_id: number = 0;
  request_status: DevicePeopleModel.RequestStatusList =
    DevicePeopleModel.RequestStatusList.associate_request;
  valid_from: Date | null = null;
  valid_to: Date | null = null;
  /* template */
  created_by: number = 0;
  modified_by: number = 0;
  created_on: Date = new Date();
  modified_on: Date = new Date();
  is_active: boolean = false;
  is_factory: boolean = false;
  parent_id: number = 0;
  is_suspended: boolean = false;
  notes: string = "";
  constructor(init?: Partial<DevicePeopleModel>) {
    super(init);
    if (init) {
      if (typeof init.id == "number") this.id = init.id;
      if (typeof init.people_id == "number") this.people_id = init.people_id;
      if (typeof init.device_id == "number") this.device_id = init.device_id;
      if (typeof init.user_id == "number") this.user_id = init.user_id;
      if (typeof init.request_status == "string")
        this.request_status = init.request_status;
      if (init.valid_from instanceof Date || typeof init.valid_from == "string")
        this.valid_from = new Date(init.valid_from);
      if (init.valid_to instanceof Date || typeof init.valid_to == "string")
        this.valid_to = new Date(init.valid_to);
      //
      if (typeof init.created_by == "number") this.created_by = init.created_by;
      if (typeof init.modified_by == "number")
        this.modified_by = init.modified_by;
      if (typeof init.is_active == "boolean") this.is_active = init.is_active;
      if (init.created_on instanceof Date || typeof init.created_on == "string")
        this.created_on = new Date(init.created_on);
      if (
        init.modified_on instanceof Date ||
        typeof init.modified_on == "string"
      )
        this.modified_on = new Date(init.modified_on);
      if (typeof init.is_suspended == "boolean")
        this.is_suspended = init.is_suspended;
      if (typeof init.parent_id == "number") this.parent_id = init.parent_id;
      if (typeof init.notes == "string") this.notes = init.notes;
    }
  }
}

export namespace DevicePeopleModel {
  export enum RequestStatusList {
    associate_request = "ASSOCIATE_REQUEST",
    associated = "ASSOCIATED",
    dissociate_request = "DISSOCIATE_REQUEST",
    dissociated = "DISSOCIATED",
  }
}

export class DevicePeopleModelCriteria extends DevicePeopleModel {
  device_serial_no: string = "";
  device_name: string = "";
  device_type: string = "";
  people_external_id: string = "";
  people_fullname: string = "";
  user_external_id: string = "";
  user_fullname: string = "";
  cable_name: string = "";
  override: boolean = false;
  constructor(init?: Partial<DevicePeopleModelCriteria>) {
    super(init);
    if (init) {
      if (typeof init.device_serial_no == "string")
        this.device_serial_no = init.device_serial_no;
      if (typeof init.device_name == "string")
        this.device_name = init.device_name;
      if (typeof init.device_type == "string")
        this.device_type = init.device_type;
      if (typeof init.people_external_id == "string")
        this.people_external_id = init.people_external_id;
      if (typeof init.people_fullname == "string")
        this.people_fullname = init.people_fullname;
      if (typeof init.user_external_id == "string")
        this.user_external_id = init.user_external_id;
      if (typeof init.user_fullname == "string")
        this.user_fullname = init.user_fullname;
      if (typeof init.cable_name == "string") this.cable_name = init.cable_name;
      if (typeof init.override == "boolean") this.override = init.override;
    }
  }
}
