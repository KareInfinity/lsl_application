import { NotificationMessage } from "../../global/models/notificationmessage.model";

export const notification_messages = {
	device_add: (type: string, user_name: string) => ({
		msg_app_key: "LS_LINK_APP",
		msg_profile_key: "DEVICE_ADD",
		msg_profile_priority: "HIGH",
		msg_type: "INFO",
		msg_text: `Device of type {0} added successfully by User {1}`,
		msg_additional_data: "",
	}),
	device_modify: (type: string, user_name: string) => ({
		msg_app_key: "LS_LINK_APP",
		msg_profile_key: "DEVICE_MODIFY",
		msg_profile_priority: "HIGH",
		msg_type: "INFO",
		msg_text: `Device of type ${type} modified successfully by User ${user_name}`,
		msg_additional_data: "",
	}),
	associate_dexcom: (people_id: string, device_serial_no: string) => ({
		msg_app_key: "LS_LINK_APP",
		msg_profile_key: "ASSOCIATE_DEXCOM",
		msg_profile_priority: "HIGH",
		msg_type: "INFO",
		msg_text: `Association of People ${people_id} and Device ${device_serial_no} was successful`,
		msg_additional_data: "",
	}),
	associate_IDH: (people_id: string, device_serial_no: string) => ({
		msg_app_key: "LS_LINK_APP",
		msg_profile_key: "ASSOCIATE_IDH",
		msg_profile_priority: "HIGH",
		msg_type: "INFO",
		msg_text: `Association of People ${people_id} and Device ${device_serial_no} was successful`,
		msg_additional_data: "",
	}),
	dissociate_dexcom: (people_id: string, device_serial_no: string) => ({
		msg_app_key: "LS_LINK_APP",
		msg_profile_key: "DISSOCIATE_DEXCOM",
		msg_profile_priority: "HIGH",
		msg_type: "INFO",
		msg_text: `Dissociation of People ${people_id} and Device ${device_serial_no} was successful`,
		msg_additional_data: "",
	}),
	dissociate_idh: (people_id: string, device_serial_no: string) => ({
		msg_app_key: "LS_LINK_APP",
		msg_profile_key: "DISSOCIATE_IDH",
		msg_profile_priority: "HIGH",
		msg_type: "INFO",
		msg_text: `Dissociation of People ${people_id} and Device ${device_serial_no} was successful`,
		msg_additional_data: "",
	}),
};
