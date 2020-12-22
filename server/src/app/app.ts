/* load environment variables */
import dotenv from "dotenv";
const env_variables: DotenvConfigOutput = dotenv.config({
	path: ".env",
});
/* libraries */
import express from "express";
import bodyParser, { json } from "body-parser";
import cors from "cors";
import compression from "compression";
import errorHandler from "errorhandler";
import * as _ from "lodash";
var path = require("path");
/* types */
import { Logger } from "log4js";
import * as ExpressCore from "express-serve-static-core";
import { DotenvConfigOutput } from "dotenv";
/* user defined imports */
import { Preset } from "./preset";
import { logger, Environment } from "./modules/global/utils";
import { GatewayModule } from "./modules/gateway";
import { AuthModule } from "./modules/auth";
import { GlobalModule } from "./modules/global";

export class ExpressApp {
	/* create express app */
	app: ExpressCore.Express = express();

	/* global logger */
	global_logger: Logger = logger.getLogger("[INITIALIZATION]");

	/* environment */
	environment?: Environment;

	constructor() {
		this.init();
	}

	init = () => {
		/* load environment variables */
		this.environment = new Environment();

		this.global_logger.info(
			"ENVIRONMENT VARIABLES -> " + JSON.stringify(this.environment)
		);

		/* set host ip address */
		this.app.set("host", process.env.HOST || "0.0.0.0");

		/* set port */
		this.app.set("port", this.environment.PORT || 3000);

		/* omit to use hit server with self signed certificate */
		process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

		/* enable cross origin resource sharing */
		this.app.use(cors());

		/* make ui static resource */
		this.app.use(express.static(path.join(__dirname, "../../ui-dist")));

		/* response compression middleware */
		this.app.use(compression());

		/* middleware that only parses json and only looks at requests where the Content-Type header matches the type option. */
		this.app.use(bodyParser.json());

		this.app.use(bodyParser.text());

		/* global module */
		this.app.use("/global/api", GlobalModule);

		/* auth module */
		if (this.environment.AUTH) this.app.use("/auth/api", AuthModule);

		/* gateway module */
		if (this.environment.GATEWAY)
			this.app.use("/lifeshield/api", GatewayModule);

		/* ui */
		this.app.get("*", (req, res, next) => {
			try {
				res.sendFile(path.join(__dirname, "../../ui-dist/index.html"));
			} catch (error) {
				next(error);
			}
		});

		/* unexpected server error handler */
		if (this.environment.NODE_ENV == "development") {
			/* only use in development */
			/* renders error message as readable html format */
			this.app.use(errorHandler());
		} else {
			/* returns blunt error on production mode for integrity */
			this.app.use((err: any, req: any, res: any, next: any) => {
				res.status(500).send("Server Error");
			});
		}
	};
	start = async () => {
		try {
			/* preset before starting server */
			const preset = new Preset();

			/* parallel preset, server wont wait for it to complete */
			preset.synchronous();

			/* server will wait for this preset to complete if it throws any error server wont start */
			await preset.asynchronous();

			/* start the server */
			this.app.listen(this.app.get("port"), this.app.get("host"), () => {
				this.global_logger.info(
					`Server running at http://${this.app.get(
						"host"
					)}:${this.app.get("port")}`
				);
			});
		} catch (e) {
			var error = e;
			this.global_logger.error("Failed ->", JSON.stringify(error));
		}
	};
}
