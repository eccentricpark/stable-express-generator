import { Service } from 'typedi';
import { Database } from '../config/Database';

@Service()
export class UserRepository {
	async findAll() {
		const connection = await Database.getInstance().getConnection();
		try {
			const [rows] = await connection.query('SELECT * FROM stable_user', []);
			return rows;
		} finally {
			// 연결을 반환하여 pool에 다시 넣습니다.
			connection.release();
		}
	}
}
