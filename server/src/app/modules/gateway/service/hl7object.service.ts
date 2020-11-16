import { using } from "../../global/utils";
import { BaseService } from "./base.service";
import { IResult, ConnectionPool, Transaction } from "mssql";
import * as _ from "lodash";
import { ErrorResponse } from "../../global/models/errorres.model";
// import { DeviceModel } from "../models/device.model";
import { PeopleModel } from "../models/people.model";
// import { PatientVisitModel } from "../models/patientvisit.model";
// import { PatientMedicationModel, PatientMedicationCustomModel } from "../models/patientmedication.model";
// import { PatientOrderModel, PatientorderForAlarmsWithoutOrder, PatientorderCriteriaForAlarmsWithoutOrder } from "../models/patientorder.model";
// import { DeviceObservationModel, DeviceObservationGraphModel, GraphData } from "../models/deviceobservation.model";
// import { AlarmObservationModel } from "../models/alarmobservation.model";
import { parse } from "dotenv/types";
import moment, { Moment } from "moment";

export class HL7ObjectService extends BaseService {
	sql_insert_patient = `INSERT tblPeople (
		people_type, people_class, people_id, dob, admission_dttm, first_name, 
		middle_name, last_name, gender, race, people_address, country_code, 
		phone_home, phone_business, primary_language, marital_status,  
		primary_account_no, is_discharged, discharged_dttm, is_alive, death_dttm, 
		point_of_care, room, bed, facility, building, visit_number, people_height, 
		people_weight, diagnosis_code, created_by, created_on, is_active)
		OUTPUT INSERTED.id
		VALUES (
		@people_type, @people_class, @people_id, @dob, @admission_dttm, @first_name, 
		@middle_name, @last_name, @gender, @race, @people_address, @country_code, 
		@phone_home, @phone_business, @primary_language, @marital_status,
		@primary_account_no, @is_discharged, @discharged_dttm, @is_alive, @death_dttm,
		@point_of_care, @room, @bed, @facility, @building, @visit_number, @people_height,
		@people_weight, @diagnosis_code, @created_by, @created_on, @is_active)
	`;

	sql_find_patient_by_key = `SELECT COALESCE(id, -1) AS id FROM tblPeople`;

	async findPatientByKey(_id: string): Promise<number> {
		var result: number = 0;
		try {
			await using(this.db.getDisposablePool(), async (pool) => {
				var client = await pool.connect();
				var qb = new this.utils.QueryBuilder(this.sql_find_patient_by_key);
				if (_id.length > 0) {
					qb.addParameter("people_id", _id, "=");
				}
				var query_string = qb.getQuery();
				var { recordset }: IResult<any> = await client.query(
					query_string
				);
				if (recordset.length > 0) {
					result = recordset[0].id;
				}
			});
		} catch (error) {
			throw error;
		}
		return result;
	}

	async savePatientData(_people_data: PeopleModel): Promise<number> {
		let result: number = 0;
		try {
			await using(this.db.getDisposablePool(), async pool => {
				const client: ConnectionPool = await pool.connect();
				const transaction: Transaction = pool.getTransaction(
					client
				);
				try {
					await transaction.begin();
					var result_temp: IResult<any> = await pool
						.getRequest(transaction)
						.input("people_type", this.db.TYPES.VarChar, _people_data.people_type)
						.input("people_class", this.db.TYPES.VarChar, _people_data.people_class)
						.input("people_id", this.db.TYPES.VarChar, _people_data.people_id)
						.input("first_name", this.db.TYPES.VarChar, _people_data.first_name)
						.input("middle_name", this.db.TYPES.VarChar, _people_data.middle_name)
						.input("last_name", this.db.TYPES.VarChar, _people_data.last_name)
						.input("dob", this.db.TYPES.DateTime, _people_data.dob)
						.input("admission_dttm", this.db.TYPES.DateTime, _people_data.admission_dttm)
						.input("gender", this.db.TYPES.VarChar, _people_data.gender)
						.input("race", this.db.TYPES.VarChar, _people_data.race)
						.input("people_address", this.db.TYPES.VarChar, _people_data.address)
						.input("country_code", this.db.TYPES.VarChar, _people_data.country_code)
						.input("phone_home", this.db.TYPES.VarChar, _people_data.phone_home)
						.input("phone_business", this.db.TYPES.VarChar, _people_data.phone_business)
						.input("primary_language", this.db.TYPES.VarChar, _people_data.primary_language)
						.input("marital_status", this.db.TYPES.VarChar, _people_data.marital_status)
						.input("primary_account_no", this.db.TYPES.VarChar, _people_data.primary_account_no)
						.input("is_discharged", this.db.TYPES.Bit, _people_data.is_discharged)
						.input("discharged_dttm", this.db.TYPES.DateTime, _people_data.discharged_dttm)
						.input("is_alive", this.db.TYPES.Bit, _people_data.is_alive)
						.input("death_dttm", this.db.TYPES.DateTime, _people_data.death_dttm)
						.input("point_of_care", this.db.TYPES.VarChar, _people_data.point_of_care)
						.input("room", this.db.TYPES.VarChar, _people_data.room)
						.input("bed", this.db.TYPES.VarChar, _people_data.bed)
						.input("facility", this.db.TYPES.VarChar, _people_data.facility)
						.input("building", this.db.TYPES.VarChar, _people_data.building)
						.input("visit_number", this.db.TYPES.VarChar, _people_data.visit_number)
						.input("people_height", this.db.TYPES.VarChar, _people_data.people_height)
						.input("people_weight", this.db.TYPES.VarChar, _people_data.people_weight)
						.input("diagnosis_code", this.db.TYPES.NVarChar, _people_data.diagnosis_code)
						.input("created_by", this.db.TYPES.BigInt, _people_data.created_by)
						.input("created_on", this.db.TYPES.DateTime, _people_data.created_on)
						.input("is_active", this.db.TYPES.Bit, _people_data.is_active)
						.query(this.sql_insert_patient);
					if (result_temp.recordset.length > 0)
						_.get(result_temp, "recordset.0.id", 0) > 0 ? result = result_temp.recordset[0].id : result = 0;
					await transaction.commit();
					if (!result && _.get(result_temp, "recordset.0.id", 0) == 0) {
						throw new ErrorResponse({
							item: _people_data,
							message: `There was some issue in Creating the Data`
						});
					}
				} catch (transaction_scope_error) {
					if (!(transaction_scope_error instanceof ErrorResponse)) {
						await transaction.rollback();
						throw (new ErrorResponse<PeopleModel>({
							message: transaction_scope_error.message,
							item: _people_data,
						}));
					}
					else
						throw transaction_scope_error;
				}
			})
		} catch (error) {
			throw error;
		}
		return result;
	}
}