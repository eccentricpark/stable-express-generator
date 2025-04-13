import { Service } from 'typedi';
import { useConnection, useTransaction } from '../../config/database-handler';

/**
 * Repository는 필요하면 커스텀하고 필요없으면 삭제
 */
@Service()
export class UserRepository {
	findAll() {
		return {
			name : "Test Developer",
			age : "25",
			message : "Hello!"
		};
	}

	// 데이터베이스 쿼리는 아래처럼 작성하세요.
	// insert, update, delete는 useTransaction으로 바꾸고 적절한 SQL을 적용
	async findOneByAniName(name: string) {
    return useConnection(async (connection) => {
      const [rows] = await connection.query(`SELECT name, age, message FROM T_USER WHERE name = ?`, [`%${name}%`]);
      return rows;
    });
  }
}
