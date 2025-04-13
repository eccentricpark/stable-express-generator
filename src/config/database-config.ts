import { createPool, Pool } from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

export class Database {
	private static instance: Pool;

	public static getInstance(): Pool {
		if (!Database.instance) {
			Database.instance = createPool({
				database: process.env.DATABASE,
				host: process.env.DATABASE_HOST,
				user: process.env.DATABASE_USER,
				password: process.env.DATABASE_PASSWORD,
				waitForConnections: true,
				charset: "utf8",
				connectionLimit: 10,
				queueLimit: 0
			});
		}
		return Database.instance;
	}
}
