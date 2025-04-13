// 예시: /utils/db.ts
import { Database } from './database-config';
import { PoolConnection } from 'mysql2/promise';

export async function useConnection<T>(handler: (conn: PoolConnection) => Promise<T>): Promise<T> {
	const connection = await Database.getInstance().getConnection();
	try {
		return await handler(connection);
	} finally {
		connection.release();
	}
}

export async function useTransaction<T>(handler: (conn: PoolConnection) => Promise<T>): Promise<T> {
	const connection = await Database.getInstance().getConnection();
	await connection.beginTransaction();
	try {
		const result = await handler(connection);

		if (process.env.NODE_ENV === 'test') {
			console.log("테스트 환경이므로 db에 반영되지 않습니다.");
			// 테스트 환경에서는 rollback
			await connection.rollback();
		} else {
			// 운영, 개발 등 실제 환경에서는 commit
			await connection.commit();
		}

		return result;
	} catch (err) {
		await connection.rollback();
		throw err;
	} finally {
		connection.release();
	}
}