import sql from "mssql";
import { IDisposable, Environment } from ".";
import { ConnectionPool, Transaction, Request, TYPES, config } from "mssql";
import * as _ from "lodash";

export class DisposablePool implements IDisposable {
	pool: ConnectionPool;
	client?: ConnectionPool;
	constructor(pool?: ConnectionPool) {
		this.pool = pool!;
	}
	async connect() {
		try {
			this.client = await this.pool!.connect();
			return this.client;
		} catch (e) {
			throw e;
		}
	}
	async dispose() {
		try {
			if (this.client) this.client.close();
		} catch (e) {
			throw e;
		}
	}
	getTransaction(client: ConnectionPool) {
		var transaction: Transaction;
		try {
			transaction = new sql.Transaction(client);
		} catch (error) {
			throw error;
		}
		return transaction;
	}
	getRequest(param: Transaction | ConnectionPool) {
		var request: Request;
		try {
			if (param instanceof Transaction) request = new sql.Request(param);
			else if (param instanceof ConnectionPool)
				request = new sql.Request(param);
			else request = new sql.Request();
		} catch (error) {
			throw error;
		}
		return request;
	}
}

export class DB {
	TYPES = TYPES;
	config: config;
	constructor(config?: config) {
		if (config) {
			this.config = config;
		} else {
			const environment = new Environment();
			this.config = {
				user: environment.SQL_SERVER_USER,
				password: environment.SQL_SERVER_PASSWORD,
				server: environment.SQL_SERVER as string,
				database: environment.SQL_SERVER_DATABASE as string,
				port: environment.SQL_SERVER_PORT,
				options: {
					useUTC: false,
					encrypt: false, // Use this if you're on Windows Azure
					instanceName: environment.SQL_SERVER_INSTANCE,
				},
			};
		}
	}
	getPool() {
		var pool: ConnectionPool;
		try {
			pool = new sql.ConnectionPool(this.config);
		} catch (error) {
			throw error;
		}
		return pool;
	}
	getDisposablePool() {
		var disposable_pool: DisposablePool;
		try {
			disposable_pool = new DisposablePool(this.getPool());
		} catch (error) {
			throw error;
		}
		return disposable_pool;
	}
	getCustomPool(config: config) {
		var pool: ConnectionPool;
		try {
			pool = new sql.ConnectionPool(config);
		} catch (error) {
			throw error;
		}
		return pool;
	}
	getCustomDisposablePool(config: config) {
		var disposable_pool: DisposablePool;
		try {
			disposable_pool = new DisposablePool(this.getCustomPool(config));
		} catch (error) {
			throw error;
		}
		return disposable_pool;
	}
}

// export const db = new DB();
