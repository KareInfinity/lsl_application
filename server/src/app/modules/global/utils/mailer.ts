import { Transporter, Transport } from "nodemailer";

const nodemailer = require("nodemailer");

class Mailer {
	nodemailer = nodemailer;
	transporter?: Transporter;
	host_email: string | undefined = undefined;
	constructor() {}
	async init() {
		try {
			// let testAccount = await nodemailer.createTestAccount();
			// create reusable transporter object using the default SMTP transport
			/* this.transporter = nodemailer.createTransport({
				host: "smtp.provider.com",
				port: 465,
				secure: true, // true for 465, false for other ports
				auth: {
					user: "user@domain.com", // generated ethereal user
					pass: "" // generated ethereal password
				}
            }); */
			this.host_email = "icumed.innovation@gmail.com";
			this.transporter = nodemailer.createTransport({
				host: "smtp.gmail.com",
				port: 465,
				secure: true, // true for 465, false for other ports
				auth: {
					user: this.host_email, // generated ethereal user
					pass: "Undefined!", // generated ethereal password
				},
			});
		} catch (error) {
			throw error;
		}
	}
	initializeMailServer(_mail_server: any) {
		let result: any = null;
		try {
			result = this.transporter = nodemailer.createTransport({
				host: _mail_server.smtp_address,
				port: _mail_server.port,
				secure: true, // true for 465, false for other ports
				auth: {
					user: _mail_server.username,
					pass: _mail_server.password,
				},
			});
			if (result != null) {
				result.error = null;
			}
			// console.log("Email Server set at run time: ", result);
		} catch (error) {
			if (result == null) {
				result = {};
			}
			result.error = error;
			// throw error;
		}
		return result;
	}
}
const mailer = new Mailer();
export { mailer, Mailer };
