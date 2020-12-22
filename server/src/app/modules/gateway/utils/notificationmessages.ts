import { NotificationMessage } from "../../global/models/notificationmessage.model";

export const notification_messages = {
	device_add: (type: string, user_name: string) =>
		new NotificationMessage({
			msg_app_key: "LS_LINK_APP",
			msg_profile_key: "DEVICE_ADD",
			msg_profile_priority: "HIGH",
			msg_type: "INFO",
			msg_text: `Device of type {0} added successfully by User {1}`,
			msg_additional_data: "",
		}),
	device_modify: (type: string, user_name: string) =>
		new NotificationMessage({
			msg_app_key: "LS_LINK_APP",
			msg_profile_key: "DEVICE_MODIFY",
			msg_profile_priority: "HIGH",
			msg_type: "INFO",
			msg_text: `Device of type ${type} modified successfully by User ${user_name}`,
			msg_additional_data: "",
		}),
	associate_cable: (cable_name: string) =>
		new NotificationMessage({
			msg_app_key: "LS_LINK_APP",
			msg_profile_key: "ASSOCIATE_CABLE",
			msg_profile_priority: "HIGH",
			msg_type: "INFO",
			msg_text: `Association of cable ${cable_name} was successful`,
			msg_additional_data: "",
		}),
	associate_cable_failure: (cable_name: string, message: string = "") =>
		new NotificationMessage({
			msg_app_key: "LS_LINK_APP",
			msg_profile_key: "ASSOCIATE_CABLE",
			msg_profile_priority: "HIGH",
			msg_type: "INFO",
			msg_text: `Association of cable ${cable_name} failed`,
			msg_additional_data: message,
			activity_status: "FAILURE",
		}),
	associate_dexcom: (people_id: string, device_serial_no: string) =>
		new NotificationMessage({
			msg_app_key: "LS_LINK_APP",
			msg_profile_key: "ASSOCIATE_DEXCOM",
			msg_profile_priority: "HIGH",
			msg_type: "INFO",
			msg_text: `Association of People ${people_id} and Device ${device_serial_no} was successful`,
			msg_additional_data: "",
		}),
	associate_dexcom_failure: (
		people_id: string,
		device_serial_no: string,
		message: string = ""
	) =>
		new NotificationMessage({
			msg_app_key: "LS_LINK_APP",
			msg_profile_key: "ASSOCIATE_DEXCOM",
			msg_profile_priority: "HIGH",
			msg_type: "INFO",
			msg_text: `Association of People ${people_id} and Device ${device_serial_no} failed`,
			msg_additional_data: message,
			activity_status: "FAILURE",
		}),
	associate_IDH: (people_id: string, device_serial_no: string) =>
		new NotificationMessage({
			msg_app_key: "LS_LINK_APP",
			msg_profile_key: "ASSOCIATE_IDH",
			msg_profile_priority: "HIGH",
			msg_type: "INFO",
			msg_text: `Association of People ${people_id} and Device ${device_serial_no} was successful`,
			msg_additional_data: "",
			activity_status: "SUCCESS",
		}),
	associate_IDH_failure: (
		people_id: string,
		device_serial_no: string,
		message: string = ""
	) =>
		new NotificationMessage({
			msg_app_key: "LS_LINK_APP",
			msg_profile_key: "ASSOCIATE_IDH",
			msg_profile_priority: "HIGH",
			msg_type: "INFO",
			msg_text: `Association of People ${people_id} and Device ${device_serial_no} failed`,
			msg_additional_data: message,
			activity_status: "FAILURE",
		}),
	dissociate_dexcom: (people_id: string, device_serial_no: string) =>
		new NotificationMessage({
			msg_app_key: "LS_LINK_APP",
			msg_profile_key: "DISSOCIATE_DEXCOM",
			msg_profile_priority: "HIGH",
			msg_type: "INFO",
			msg_text: `Dissociation of People ${people_id} and Device ${device_serial_no} was successful`,
			msg_additional_data: "",
		}),
	dissociate_dexcom_failure: (people_id: string, device_serial_no: string) =>
		new NotificationMessage({
			msg_app_key: "LS_LINK_APP",
			msg_profile_key: "DISSOCIATE_DEXCOM",
			msg_profile_priority: "HIGH",
			msg_type: "INFO",
			msg_text: `Dissociation of People ${people_id} and Device ${device_serial_no} failed`,
			msg_additional_data: "",
			activity_status: "FAILURE",
		}),
	dissociate_idh: (people_id: string, device_serial_no: string) =>
		new NotificationMessage({
			msg_app_key: "LS_LINK_APP",
			msg_profile_key: "DISSOCIATE_IDH",
			msg_profile_priority: "HIGH",
			msg_type: "INFO",
			msg_text: `Dissociation of People ${people_id} and Device ${device_serial_no} was successful`,
			msg_additional_data: "",
		}),
	dissociate_idh_failure: (
		people_id: string,
		device_serial_no: string,
		message: string = ""
	) =>
		new NotificationMessage({
			msg_app_key: "LS_LINK_APP",
			msg_profile_key: "DISSOCIATE_IDH",
			msg_profile_priority: "HIGH",
			msg_type: "INFO",
			msg_text: `Dissociation of People ${people_id} and Device ${device_serial_no} failed`,
			msg_additional_data: message,
			activity_status: "FAILURE",
		}),
};
