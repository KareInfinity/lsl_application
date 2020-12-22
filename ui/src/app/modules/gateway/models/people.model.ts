import * as _ from "lodash";
import { Base } from "./base.model";
import { ISASHierarchyNode } from "./misc.model";

export class PeopleModel extends Base {
  id: number = 0;
  people_type: string = "";
  people_class: string = "";
  external_id: string = "";
  dob: Date | null = null;
  admission_dttm: Date | null = null;
  first_name: string = "";
  middle_name: string = "";
  last_name: string = "";
  title: string = "";
  gender: string = "";
  alias: string = "";
  race: string = "";
  people_address = "";
  address: string = "";
  country_code: string = "";
  phone_home: string = "";
  phone_business: string = "";
  primary_language: string = "";
  marital_status: string = "";
  religion: string = "";
  primary_account_no: string = "";
  is_discharged: boolean = false;
  discharged_dttm: Date | null = null;
  is_alive: boolean = false;
  death_dttm: Date | null = null;
  point_of_care: string = "";
  room: string = "";
  bed: string = "";
  facility: string = "";
  building: string = "";
  visit_number: string = "";
  people_height: string = "";
  people_weight: string = "";
  diagnosis_code: string = "";
  is_registered: boolean = false;
  /* template */
  created_by: number = 0;
  modified_by: number = 0;
  created_on: Date = new Date();
  modified_on: Date = new Date();
  is_active: boolean = true;
  is_factory: boolean = false;
  is_suspended: boolean = false;
  parent_id: number = 0;
  notes: string = "";
  attributes: PeopleModel.Attributes = new PeopleModel.Attributes();
  /* extensions */
  // idh_session_id: number = 0;

  constructor(init?: Partial<PeopleModel>) {
    super(init);
    if (init) {
      if (typeof init.id == "number") this.id = init.id;
      if (typeof init.people_type == "string")
        this.people_type = init.people_type;
      if (typeof init.people_class == "string")
        this.people_class = init.people_class;
      if (typeof init.external_id == "string")
        this.external_id = init.external_id;
      if (typeof init.first_name == "string") this.first_name = init.first_name;
      if (typeof init.middle_name == "string")
        this.middle_name = init.middle_name;
      if (typeof init.last_name == "string") this.last_name = init.last_name;
      if (typeof init.title == "string") this.title = init.title;
      if (init.dob instanceof Date || typeof init.dob == "string")
        this.dob = new Date(init.dob);
      if (
        init.admission_dttm instanceof Date ||
        typeof init.admission_dttm == "string"
      )
        this.admission_dttm = new Date(init.admission_dttm);
      if (typeof init.gender == "string") this.gender = init.gender;
      if (typeof init.alias == "string") this.alias = init.alias;
      if (typeof init.race == "string") this.race = init.race;
      if (typeof init.people_address == "string")
        this.people_address = init.people_address;
      if (typeof init.address == "string") this.address = init.address;
      if (typeof init.country_code == "string")
        this.country_code = init.country_code;
      if (typeof init.phone_home == "string") this.phone_home = init.phone_home;
      if (typeof init.phone_business == "string")
        this.phone_business = init.phone_business;
      if (typeof init.primary_language == "string")
        this.primary_language = init.primary_language;
      if (typeof init.marital_status == "string")
        this.marital_status = init.marital_status;
      if (typeof init.primary_account_no == "string")
        this.primary_account_no = init.primary_account_no;
      if (typeof init.is_discharged == "boolean")
        this.is_discharged = init.is_discharged;
      if (
        init.discharged_dttm instanceof Date ||
        typeof init.discharged_dttm == "string"
      )
        this.discharged_dttm = new Date(init.discharged_dttm);
      if (typeof init.is_alive == "boolean") this.is_alive = init.is_alive;
      if (init.death_dttm instanceof Date || typeof init.death_dttm == "string")
        this.death_dttm = new Date(init.death_dttm);

      if (typeof init.point_of_care == "string")
        this.point_of_care = init.point_of_care;
      if (typeof init.room == "string") this.room = init.room;
      if (typeof init.bed == "string") this.bed = init.bed;
      if (typeof init.facility == "string") this.facility = init.facility;
      if (typeof init.building == "string") this.building = init.building;
      if (typeof init.visit_number == "string")
        this.visit_number = init.visit_number;

      if (typeof init.people_height == "string")
        this.people_height = init.people_height;
      if (typeof init.people_weight == "string")
        this.people_weight = init.people_weight;
      if (typeof init.diagnosis_code == "string")
        this.diagnosis_code = init.diagnosis_code;
      if (typeof init.is_registered == "boolean")
        this.is_registered = init.is_registered;
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
      if (typeof init.is_factory == "boolean")
        this.is_factory = init.is_factory;
      if (typeof init.is_suspended == "boolean")
        this.is_suspended = init.is_suspended;
      if (typeof init.parent_id == "number") this.parent_id = init.parent_id;
      if (typeof init.notes == "string") this.notes = init.notes;
      if (init.attributes) {
        this.attributes = new PeopleModel.Attributes(init.attributes);
      }
    }
    /* extensions */
    // if (typeof init?.idh_session_id == "number")
    // 	this.idh_session_id = init.idh_session_id;
  }
}
export namespace PeopleModel {
  export enum PEOPLE_TYPE {
    all = "ALL",
    patient = "PATIENT",
    employee = "EMPLOYEE",
  }
  export class Attributes {
    facility_node: ISASHierarchyNode = new ISASHierarchyNode();
    constructor(init?: Attributes | string) {
      if (init) {
        if (typeof init == "string") {
          try {
            init = JSON.parse(init);
          } catch (error) {
            init = new Attributes();
          }
        }
        if (init && typeof init != "string") {
          this.facility_node = new ISASHierarchyNode(init.facility_node);
        }
      }
    }
  }
}
