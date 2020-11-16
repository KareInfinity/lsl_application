import * as _ from "lodash";
import { logger, mailer, Environment } from "./modules/global/utils";
import { GatewayPreset } from "./modules/gateway/preset";
import { AuthPreset } from "./modules/auth/preset";
import { GlobalPreset } from "./modules/global/preset";
export class Preset {
	environment?: Environment;
	gateway_preset?: GatewayPreset;
	auth_preset?: AuthPreset;
	global_preset?: GlobalPreset;
	constructor() {
		this.environment = new Environment();
		this.gateway_preset = new GatewayPreset();
		this.auth_preset = new AuthPreset();
		this.global_preset = new GlobalPreset();
	}
	public async asynchronous() {
		try {
			var logger_instance = logger.getLogger("[PRESET ASYNCHRONOUS]");
			logger_instance.info("STARTED");

			logger_instance.info("MAILER INITIATION STARTED");
			await mailer.init();
			logger_instance.info("MAILER INITIATION DONE");

			await this.global_preset?.asynchronous();

			if (this.environment?.AUTH) {
				await this.auth_preset?.asynchronous();
			}
			if (this.environment?.GATEWAY) {
				await this.gateway_preset?.asynchronous();
			}

			logger_instance.info("DONE");
		} catch (error) {
			throw error;
		}
	}
	synchronous() {
		var logger_instance = logger.getLogger("[PRESET SYNCHRONOUS]");
		try {
			logger_instance.info("STARTED");

			this.global_preset?.synchronous();

			if (this.environment?.AUTH) {
				this.auth_preset?.synchronous();
			}
			if (this.environment?.GATEWAY) {
				this.gateway_preset?.synchronous();
			}

			logger_instance.info("DONE");
		} catch (error) {
			logger_instance.error("FAILED", JSON.stringify(error));
		}
	}
}
