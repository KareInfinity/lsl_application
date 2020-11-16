import * as _ from "lodash";
import { Hl7Result } from "./hl7parser";
import { GPUtils } from "./gputils";
import { HL7ObjectService } from "../../gateway/service/hl7object.service";
import { PeopleModel } from "../../gateway/models/people.model";

export class Hl7Persister {
    async PersistPeople(hl7result: string): Promise<number> {
        // let result: boolean = false;
        let result: number = 0;
        var _gputils: GPUtils = new GPUtils();
        var hlobject = new Hl7Result();
        var _people_data: PeopleModel = new PeopleModel();
        var hl7_parsed_result;
        try {
            hl7_parsed_result = await hlobject.Parse(hl7result);
        }
        catch (hl7_parsed_result_error) { throw hl7_parsed_result_error; }
        //
        var _patient_class: string = "", _patient_diagnosis: string = "";
        var _admission_dttm: string = "", _point_of_care: string = "", _room: string = "",
            _bed: string = "", _facility: string = "", _building: string = "", _visit_number: string = "";
        //
        var _people_id: number = 0;
        // For all Service Objects except Device
        var hl7_service: HL7ObjectService = new HL7ObjectService();
        // _devicecriteria.name = result.DeviceID;
        try {
            if (hl7_parsed_result.pv1 != null) {
                _patient_class = hl7_parsed_result.pv1.patientclass != null ? hl7_parsed_result.pv1.patientclass : "";
                _visit_number = hl7_parsed_result.pv1.visitnumber != null ? hl7_parsed_result.pv1.visitnumber : "";
                _admission_dttm = hl7_parsed_result.pv1.admission_dttm != null ? hl7_parsed_result.pv1.admission_dttm : "";
                _point_of_care = hl7_parsed_result.pv1.assignedpatientlocation.nursingunit != null ? hl7_parsed_result.pv1.assignedpatientlocation.nursingunit : "";
                _room = hl7_parsed_result.pv1.assignedpatientlocation.room != null ? hl7_parsed_result.pv1.assignedpatientlocation.room : "";
                _bed = hl7_parsed_result.pv1.assignedpatientlocation.bed != null ? hl7_parsed_result.pv1.assignedpatientlocation.bed : "";
                _facility = hl7_parsed_result.pv1.assignedpatientlocation.facility != null ? hl7_parsed_result.pv1.assignedpatientlocation.facility : "";
                _building = hl7_parsed_result.pv1.assignedpatientlocation.building != null ? hl7_parsed_result.pv1.assignedpatientlocation.building : "";
            }
            if (hl7_parsed_result.dg1 != null) {
                if (hl7_parsed_result.dg1.diagnosis_identifier_list != null)
                    _patient_diagnosis = hl7_parsed_result.dg1.diagnosis_identifier_list.text;
            }
            if (hl7_parsed_result.pid != null) {
                if (hl7_parsed_result.pid.patientidentifierlist != null &&
                    hl7_parsed_result.pid.patientidentifierlist.idnumber != null &&
                    hl7_parsed_result.pid.patientidentifierlist.idnumber.length > 0) {
                    _people_id = await hl7_service.findPatientByKey(hl7_parsed_result.pid.patientidentifierlist.idnumber);
                    if (_people_id <= 0) {
                        _people_data.is_active = true;
                        _people_data.people_type = PeopleModel.PEOPLE_TYPE.patient;
                        _people_data.people_class = _patient_class;
                        _people_data.people_id = hl7_parsed_result.pid.patientidentifierlist.idnumber;
                        _people_data.first_name = hl7_parsed_result.pid.patientname.givenname;
                        _people_data.last_name = hl7_parsed_result.pid.patientname.familyname;
                        _people_data.gender = hl7_parsed_result.pid.administractivesex;
                        _people_data.dob = hl7_parsed_result.pid.datetimeofbirth != null && hl7_parsed_result.pid.datetimeofbirth.length > 0 ? _gputils.FromHL7Date(hl7_parsed_result.pid.datetimeofbirth) : new Date();
                        _people_data.admission_dttm = _admission_dttm != null && _admission_dttm.length > 0 ? _gputils.FromHL7Date(_admission_dttm) : null;
                        //
                        _people_data.race = hl7_parsed_result.pid.race;
                        _people_data.address = hl7_parsed_result.pid.address;
                        _people_data.country_code = hl7_parsed_result.pid.country_code;
                        _people_data.phone_home = hl7_parsed_result.pid.phone_home;
                        _people_data.phone_business = hl7_parsed_result.pid.phone_business;
                        _people_data.primary_language = hl7_parsed_result.pid.primary_language;
                        _people_data.marital_status = hl7_parsed_result.pid.marital_status;
                        _people_data.primary_account_no = hl7_parsed_result.pid.primary_account_no;
                        _people_data.is_discharged = hl7_parsed_result.pid.is_discharged;
                        _people_data.discharged_dttm = hl7_parsed_result.pid.discharged_dttm != null && hl7_parsed_result.pid.discharged_dttm.length > 0 ? _gputils.FromHL7Date(hl7_parsed_result.pid.discharged_dttm) : null;
                        if (hl7_parsed_result.pid.death_status != null && hl7_parsed_result.pid.death_status.length > 0) {
                            _people_data.is_alive = hl7_parsed_result.pid.death_status == "NO" ? true : false;
                        }
                        _people_data.death_dttm = hl7_parsed_result.pid.death_dttm != null && hl7_parsed_result.pid.death_dttm.length > 0 ? _gputils.FromHL7Date(hl7_parsed_result.pid.death_dttm) : null;
                        _people_data.point_of_care = _point_of_care;
                        _people_data.room = _room;
                        _people_data.bed = _bed;
                        _people_data.facility = _facility;
                        _people_data.building = _building;
                        _people_data.visit_number = _visit_number;
                        //    
                        _people_data.people_height = "-1";
                        _people_data.people_weight = "-1";
                        _people_data.diagnosis_code = _patient_diagnosis;
                        _people_data.created_on = new Date();
                        _people_id = await hl7_service.savePatientData(_people_data);
                    }
                }
            }
            result = _people_id;
        } catch (hl7persister_error) {
            console.log("Failed record:", _people_data);
            throw hl7persister_error;
        }
        return result
    }
}

/* export class Hl7Persister {
    async Persist(hl7result: string): Promise<AlarmObservationModel> {
        // let result: boolean = false;
        let result: AlarmObservationModel = new AlarmObservationModel();
        var _gputils: GPUtils = new GPUtils();
        var hlobject = new Hl7Result();
        var hl7_parsed_result = await hlobject.Parse(hl7result);
        //
        var _patient_Key: string = "", _visit_key: string = "", _order_key: string = "", _medication_key: string = "";
        //
        var _patient_id: number = 0, _patient_visit_id: number = 0;
        var _patient_order_id: number = 0, _patient_medication_id: number = 0;
        var _device_obs_id: number = 0, _alarm_obs_id: number = 0;
        // Initialization for Model objects
        var _device_data: DeviceModel = new DeviceModel();
        var _patient_data: PatientModel = new PatientModel();
        var _patient_visit_data: PatientVisitModel = new PatientVisitModel();
        var _patient_order_data: PatientOrderModel = new PatientOrderModel();
        var _patient_order_for_alarm: PatientorderForAlarmsWithoutOrder = new PatientorderForAlarmsWithoutOrder();
        var _patient_alarm_data_without_order: PatientorderForAlarmsWithoutOrder = new PatientorderForAlarmsWithoutOrder();
        var _patient_medication_data: PatientMedicationModel = new PatientMedicationModel();
        var _device_obs_data: DeviceObservationModel = new DeviceObservationModel();
        var _alarm_obs_data: AlarmObservationModel = new AlarmObservationModel();
        // For all Service Objects except Device
        var hl7_service: HL7ObjectService = new HL7ObjectService();
        // _devicecriteria.name = result.DeviceID;
        var _device_name: string =
            (hl7_parsed_result.obx != null && hl7_parsed_result.obx[2] != null &&
                hl7_parsed_result.obx[2].equipmentinstanceidentifier != null &&
                hl7_parsed_result.obx[2].equipmentinstanceidentifier.length > 0 ? hl7_parsed_result.obx[2].equipmentinstanceidentifier : "");
        var _device_serial_id: string =
            (hl7_parsed_result.obx != null && hl7_parsed_result.obx[2] != null &&
                hl7_parsed_result.obx[2].observationsubid != null &&
                hl7_parsed_result.obx[2].observationsubid.length > 0 ? hl7_parsed_result.obx[2].observationsubid : "");
        // Models.Devices devices = devicesDataService.Find(message.key,result.DeviceID);
        var _device_service: DeviceService = new DeviceService();
        var _device_id: number = await _device_service.getDeviceBySerialID(_device_serial_id);
        if (_device_id == 0) {
            var _device_data_array: Array<DeviceModel> = new Array<DeviceModel>();
            _device_data.device_name = _device_name;
            _device_data.device_serial_id = _device_serial_id;
            _device_data.created_on = new Date();
            _device_data.is_active = true;
            _device_data_array.push(_device_data);
            _device_data_array = await _device_service.createInBulk(_device_data_array);
            //
            _device_id = _device_data_array[0].id;
        }
        try {
            if (hl7_parsed_result.pid != null) {
                // Generate Hash Key Patient data for Uniqueness
                var _pat_key_input: string =
                    hl7_parsed_result.pid.patientidentifierlist.identifiertypecode +
                        hl7_parsed_result.pid.patientidentifierlist.idnumber +
                        hl7_parsed_result.pid.administractivesex +
                        (hl7_parsed_result.pid.datetimeofbirth != null && hl7_parsed_result.pid.datetimeofbirth.length > 0) ? hl7_parsed_result.pid.datetimeofbirth : "" +
                        hl7_parsed_result.pid.patientname.familyname +
                        hl7_parsed_result.pid.patientname.givenname;
                _patient_Key = await _gputils.HashCode(_pat_key_input);
                //
                _patient_id = await hl7_service.findPatientByKey(_patient_Key);
                if (_patient_id <= 0) {
                    _patient_data.key = _patient_Key;
                    _patient_data.is_active = true;
                    _patient_data.version = 1;
                    _patient_data.created_on = new Date();
                    _patient_data.patient_id = hl7_parsed_result.pid.patientidentifierlist.idnumber;
                    _patient_data.gender = hl7_parsed_result.pid.administractivesex;
                    _patient_data.family_name = hl7_parsed_result.pid.patientname.familyname;
                    _patient_data.given_name = hl7_parsed_result.pid.patientname.givenname;
                    _patient_data.patient_id_authority = hl7_parsed_result.pid.patientidentifierlist.assigningauthority;
                    _patient_data.name_type = hl7_parsed_result.pid.patientname.nametypecode;
                    _patient_data.date_of_birth = hl7_parsed_result.pid.datetimeofbirth != null && hl7_parsed_result.pid.datetimeofbirth.length > 0 ? new Date() : _gputils.FromHL7Date(hl7_parsed_result.pid.datetimeofbirth);
                    _patient_id = await hl7_service.savePatientData(_patient_data);
                }
            }
            //
            if (hl7_parsed_result.pv1 != null) {
                var _pat_visit_key_input: string =
                    hl7_parsed_result.pv1.visitnumber +
                    hl7_parsed_result.pv1.assignedpatientlocation.nursingunit +
                    hl7_parsed_result.pv1.assignedpatientlocation.facility +
                    hl7_parsed_result.pv1.assignedpatientlocation.building +
                    hl7_parsed_result.pv1.assignedpatientlocation.floor +
                    hl7_parsed_result.pv1.assignedpatientlocation.room +
                    hl7_parsed_result.pv1.assignedpatientlocation.bed +
                    _patient_id.toString();
                _visit_key = await _gputils.HashCode(_pat_visit_key_input);
                //
                _patient_visit_id = await hl7_service.findPatientVisitByKey(_patient_id, _visit_key);
                if (_patient_visit_id <= 0) {
                    _patient_visit_data.key = _visit_key;
                    _patient_visit_data.is_active = true;
                    _patient_visit_data.version = 1;
                    _patient_visit_data.created_on = new Date();
                    _patient_visit_data.patient_class = hl7_parsed_result.pv1.patientclass;
                    _patient_visit_data.nursing_unit = hl7_parsed_result.pv1.assignedpatientlocation.nursingunit;
                    _patient_visit_data.room = hl7_parsed_result.pv1.assignedpatientlocation.room;
                    _patient_visit_data.bed = hl7_parsed_result.pv1.assignedpatientlocation.bed;
                    _patient_visit_data.facility = hl7_parsed_result.pv1.assignedpatientlocation.facility;
                    _patient_visit_data.building = hl7_parsed_result.pv1.assignedpatientlocation.building;
                    _patient_visit_data.floor = hl7_parsed_result.pv1.assignedpatientlocation.floor;
                    _patient_visit_data.patient_id = _patient_id;
                    // _patient_visit_data.location_id = devices.locationid;
                    _patient_visit_data.device_id = _device_id;
                    //_patient_visit_data.organizationid = devices.organizationid;
                    _patient_visit_data.visit_number = hl7_parsed_result.pv1.visitnumber;
                    _patient_visit_id = await hl7_service.savePatientVisitData(_patient_visit_data);
                }
            }
            //
            if (hl7_parsed_result.orc != null) {
                var _order_key_input: string =
                    _patient_Key +
                    _visit_key +
                    hl7_parsed_result.orc.actionby.idnumber +
                    hl7_parsed_result.orc.actionby.familyname +
                    hl7_parsed_result.orc.actionby.givenname;
                _order_key = await _gputils.HashCode(_order_key_input);
                //
                _patient_order_id = await hl7_service.findPatientOrderByKey(_patient_id, _order_key);
                if (_patient_order_id <= 0) {
                    _patient_order_data.key = _order_key;
                    _patient_order_data.is_active = true;
                    _patient_order_data.version = 1;
                    _patient_order_data.created_on = new Date();
                    _patient_order_data.patient_id = _patient_id;
                    //_patient_order_data.locationid = devices.locationid;
                    //_patient_order_data.organizationid = devices.organizationid;
                    _patient_order_data.device_id = _device_id;
                    _patient_order_data.action_by_id = hl7_parsed_result.orc.actionby.idnumber;
                    _patient_order_data.action_by_family_name = hl7_parsed_result.orc.actionby.familyname;
                    _patient_order_data.action_by_given_name = hl7_parsed_result.orc.actionby.givenname;
                    _patient_order_data.ordered_on = hl7_parsed_result.orc.datetimeoftransaction != null &&
                        hl7_parsed_result.orc.datetimeoftransaction.length > 0 ?
                        _gputils.FromHL7Date(hl7_parsed_result.orc.datetimeoftransaction) : new Date();
                    _patient_order_data.order_id = hl7_parsed_result.orc.placeordernumber.entityidentifier;
                    _patient_order_data.order_type = hl7_parsed_result.orc.placeordernumber.namespacesid;
                    _patient_order_data.patient_visit_id = _patient_visit_id != null ? _patient_visit_id : -1;
                    //
                    _patient_order_id = await hl7_service.savePatientOrderData(_patient_order_data);
                }
            }
            else if (hl7_parsed_result.obr != null) {
                if (hl7_parsed_result.obr.universalserviceidentifier.text != "MDC_EVT_ALARM") {
                    var _order_key_input: string =
                        _patient_Key +
                        _visit_key +
                        hl7_parsed_result.obr.placeordernumber.entityidentifier;
                    _order_key = await _gputils.HashCode(_order_key_input);
                    //
                    _patient_order_id = await hl7_service.findPatientOrderByKey(_patient_id, _order_key);
                    if (_patient_order_id <= 0) {
                        _patient_order_data.key = _order_key;
                        _patient_order_data.is_active = true;
                        _patient_order_data.version = 1;
                        _patient_order_data.created_on = new Date();
                        _patient_order_data.patient_id = _patient_id;
                        // _patient_order_data.locationid = devices.locationid;
                        // _patient_order_data.organizationid = devices.organizationid;
                        _patient_order_data.device_id = _device_id;
                        _patient_order_data.order_id = hl7_parsed_result.obr.universalserviceidentifier.text != "MDC_EVT_ALARM" ? hl7_parsed_result.obr.placeordernumber.entityidentifier : "";
                        //_patient_order_data.message_time = _gputils.FromHL7Date(hl7_parsed_result.obr.observationdatetime);
                        _patient_order_data.order_universal_id = hl7_parsed_result.obr.placeordernumber.universalid;
                        _patient_order_data.patient_visit_id = _patient_visit_id;
                        //
                        _patient_order_id = await hl7_service.savePatientOrderData(_patient_order_data);
                    }
                    // medicationkey = HashCode(patientKey, hl7_parsed_result.obr.placeordernumber.entityidentifier);
                    var _medication_key_input: string = _order_key;
                    _medication_key = await _gputils.HashCode(_medication_key_input);
                    //
                    _patient_medication_id = await hl7_service.findPatientMedicationByKey(_patient_id, _medication_key);
                    if (_patient_medication_id <= 0) {
                        _patient_medication_data.is_active = true;
                        _patient_medication_data.version = 1;
                        _patient_medication_data.created_on = new Date();
                        // _patient_medication_data.message_time = _gputils.FromHL7Date(hl7_parsed_result.obr.observationdatetime);
                        _patient_medication_data.key = _medication_key;
                        _patient_medication_data.patient_id = _patient_id;
                        // _patient_medication_data.locationid = devices.locationid;
                        _patient_medication_data.device_id = _device_id;
                        //_patient_medication_data.organizationid = devices.organizationid;
                        _patient_medication_data.patient_order_id = _patient_order_id;
                        _patient_medication_data.drug_code = hl7_parsed_result.obr.universalserviceidentifier.identifier;
                        _patient_medication_data.drug_name = hl7_parsed_result.obr.universalserviceidentifier.text;
                        _patient_medication_id = await hl7_service.savePatientMedicationData(_patient_medication_data);
                    }
                }
                else {
                    PUMP IDLE & ALARMS handling. Need to find out PatientOrder & MedicationID so that the records get saved with
                    these IDs, than with a -1 which cannot be tagged to which Order they were part of.
                    Code to find out what is the latest Patient Order Entry, is conjunction with Device Osbervation.
                    That PatientOrder & PatientMedication IDs should be assigned here, which shall go into the
                    DeviceObservation record.
var oparam: PatientorderCriteriaForAlarmsWithoutOrder = new PatientorderCriteriaForAlarmsWithoutOrder();
oparam.patient_id = _patient_id;
oparam.patient_visit_id = _patient_visit_id;
oparam.device_id = _device_id;
oparam.device_serial_id = _device_serial_id;
// oparam.organizationid = patient.organizationid;
// oparam.locationid = patient.locationid;
_patient_alarm_data_without_order = await hl7_service.findOrderIDForAlarmsWithoutOrder(oparam);
                }
            }

if (hl7_parsed_result.obr != null || hl7_parsed_result.obx != null) {
    if (hl7_parsed_result.obr != null) {
        _device_obs_data.is_active = true;
        _device_obs_data.version = 1;
        _device_obs_data.patient_id = _patient_id;
        _device_obs_data.patient_visit_id = _patient_visit_id;
        if (hl7_parsed_result.obr.universalserviceidentifier.text != "MDC_EVT_ALARM") {
            _device_obs_data.patient_order_id = _patient_order_id;
            _device_obs_data.patient_medication_id = _patient_medication_id;
        }
        else {
            _device_obs_data.patient_order_id = _patient_alarm_data_without_order != null ? _patient_alarm_data_without_order.patient_order_id : -1;
            _device_obs_data.patient_medication_id = _patient_alarm_data_without_order != null ? _patient_alarm_data_without_order.patient_medication_id : -1;
        }
        // _device_obs_data.locationid = devices.locationid;
        // _device_obs_data.organizationid = devices.organizationid;
        _device_obs_data.device_id = _device_id;
        _device_obs_data.created_on = new Date();
        // _device_obs_data.messagetime = hl7_parsed_result.obr.observationdatetime.FromHL7Date();
        _device_obs_data.received_on = _gputils.FromHL7Date(hl7_parsed_result.obr.observationdatetime);

        if (hl7_parsed_result.obx != null) {
            for (var i = 0; i < hl7_parsed_result.obx.length; i++) {
                switch (hl7_parsed_result.obx[i].observationidtifier.text) {
                    case "MDC_EVT_ALARM":
                        _alarm_obs_data.patient_id = _patient_id;
                        _alarm_obs_data.patient_visit_id = _patient_visit_id;
                        _alarm_obs_data.is_active = true;
                        _alarm_obs_data.version = 1;
                        // _alarm_obs_data.locationid = devices.locationid;
                        // _alarm_obs_data.organizationid = devices.organizationid;
                        _alarm_obs_data.device_id = _device_id;
                        _alarm_obs_data.device_name = hl7_parsed_result.obx[i].equipmentinstanceidentifier;
                        // _alarm_obs_data.device_id = hl7_parsed_result.obx[i].equipmentinstanceidentifier;
                        _alarm_obs_data.alarm_type = hl7_parsed_result.obx[i].observationvaluelist[1];
                        // _alarm_obs_data.observations = new ();
                        _alarm_obs_data.observations.text = hl7_parsed_result.obx[i].observationvaluelist[8];
                        break;
                    case "MDC_ATTR_ALERT_SOURCE":
                        // if (string.IsNullOrEmpty(_alarm_obs_data.device_id))
                        //    _alarm_obs_data.device_id = hl7_parsed_result.obx[i].observationvalue;
                        break;
                    case "MDC_ATTR_EVENT_PHASE":
                        _alarm_obs_data.event_phase = hl7_parsed_result.obx[i].observationvalue;
                        break;
                    case "MDC_DEV_PUMP_SOURCE_CHANNEL_LABEL":
                        _device_obs_data.device_name = hl7_parsed_result.obx[i].equipmentinstanceidentifier;
                        _device_obs_data.device_channel = hl7_parsed_result.obx[i].observationvaluelist[0];
                        // patientmedication.device_id = hl7_parsed_result.obx[i].equipmentinstanceidentifier;
                        // patientmedication.device_system = hl7_parsed_result.obx[i].observationvaluelist[0];
                        break;
                    case "MDC_ATTR_ALARM_STATE":
                        _alarm_obs_data.alarm_status = hl7_parsed_result.obx[i].observationvalue;
                        break;
                    case "MDC_DEV_PUMP_CURRENT_DELIVERY_STATUS":
                        _device_obs_data.delivery_status = hl7_parsed_result.obx[i].observationvaluelist[1];
                        break;
                    case "MDC_VOL_FLUID_TBI":
                        _device_obs_data.volume_tbi = parseFloat(hl7_parsed_result.obx[i].observationvalue);
                        _device_obs_data.volume_unit_code = hl7_parsed_result.obx[i].units.text;
                        _device_obs_data.volume_unit_name = hl7_parsed_result.obx[i].units.alternatetext;
                        _device_obs_data.volume_unit_system = hl7_parsed_result.obx[i].units.nameofcodingsystem;
                        break;
                    case "MDC_VOL_FLUID_DELIV":
                        _device_obs_data.volume_delivered = parseFloat(hl7_parsed_result.obx[i].observationvalue);
                        break;
                    case "MDC_DOSE_DRUG_DELIV_TOTAL":
                        break;
                    case "MDC_VOL_FLUID_TBI_REMAIN":
                        _device_obs_data.volume_remain = parseFloat(hl7_parsed_result.obx[i].observationvalue);
                        break;
                    case "MDC_TIME_PD_PROG":
                        _device_obs_data.time_plan = parseFloat(hl7_parsed_result.obx[i].observationvalue);
                        break;
                    case "MDC_TIME_PD_REMAIN":
                        _device_obs_data.time_remain = parseFloat(hl7_parsed_result.obx[i].observationvalue);
                        _device_obs_data.time_unit_name = hl7_parsed_result.obx[i].units.alternatetext;
                        _device_obs_data.time_unit_code = hl7_parsed_result.obx[i].units.text;
                        _device_obs_data.time_unit_system = hl7_parsed_result.obx[i].units.nameofcodingsystem;
                        break;
                    case "MDC_RATE_DOSE":
                        _device_obs_data.dose = parseFloat(hl7_parsed_result.obx[i].observationvalue);
                        _device_obs_data.dose_unit_name = hl7_parsed_result.obx[i].units.alternatetext;
                        _device_obs_data.dose_unit_code = hl7_parsed_result.obx[i].units.text;
                        _device_obs_data.dose_unit_system = hl7_parsed_result.obx[i].units.nameofcodingsystem;
                        break;
                    case "MDC_FLOW_FLUID_PUMP_CURRENT":
                        _device_obs_data.rate = parseFloat(hl7_parsed_result.obx[i].observationvalue);
                        _device_obs_data.rate_unit_name = hl7_parsed_result.obx[i].units.alternatetext;
                        _device_obs_data.rate_unit_code = hl7_parsed_result.obx[i].units.text;
                        _device_obs_data.rate_unit_system = hl7_parsed_result.obx[i].units.nameofcodingsystem;
                        break;
                }
            }
            //
            if (_alarm_obs_data != null) {
                // Added by KareInfinity begins ...
                // Assign the CreatedOn, and actual Message Incoming date time from the OBR segment which has the value
                _alarm_obs_data.created_on = new Date();
                if (hl7_parsed_result.obr != null) {
                    //_alarm_obs_data.message_time = _gputils.FromHL7Date(hl7_parsed_result.obr.observationdatetime);
                    _alarm_obs_data.received_on = _gputils.FromHL7Date(hl7_parsed_result.obr.observationdatetime);
                }
                // Added by KareInfinity ends ...
                _alarm_obs_id = await hl7_service.saveAlarmObservationData(_alarm_obs_data);
            }
            if (_alarm_obs_data != null) {
                _device_obs_data.alarm_id = _alarm_obs_id;
                _alarm_obs_data.id = _alarm_obs_id;
            }
            _device_obs_id = await hl7_service.saveDeviceObservationData(_device_obs_data);
            //
            if (_device_obs_id > 0 && (_patient_medication_id > 0)) {
                if (_patient_medication_data.rate == 0) {
                    _patient_medication_data.rate = _device_obs_data.rate;
                    _patient_medication_data.rate_unit_code = _device_obs_data.rate_unit_code;
                    _patient_medication_data.rate_unit_name = _device_obs_data.rate_unit_name;
                    _patient_medication_data.dose = _device_obs_data.dose;
                    _patient_medication_data.dose_unit_code = _device_obs_data.dose_unit_code;
                    _patient_medication_data.dose_unit_name = _device_obs_data.dose_unit_name;
                    _patient_medication_data.volume_tbi = _device_obs_data.volume_tbi;
                    _patient_medication_data.volume_unit_code = _device_obs_data.volume_unit_code;
                    _patient_medication_data.volume_unit_name = _device_obs_data.volume_unit_name;
                    _patient_medication_data.strength = _device_obs_data.strength;
                    _patient_medication_data.strength_unit_code = _device_obs_data.strength_unit_code;
                    _patient_medication_data.strength_unit_name = _device_obs_data.strength_unit_name;
                    // _patient_medication_dataDataService.Update(_patient_medication_data);
                    hl7_service.updatePatientMedicationData(_patient_medication_data);
                }
            }
        }
    }
}
result = _alarm_obs_data;
        } catch (hl7persister_error) {
    // result = false;
    throw hl7persister_error;
}
return result
    }
} */