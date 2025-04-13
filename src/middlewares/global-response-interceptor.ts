// src/interceptors/GlobalResponseInterceptor.ts
import { Interceptor, InterceptorInterface, Action } from 'routing-controllers';
import { Service } from 'typedi';

/**
 * Controller에서 return한 값을 { data: ..., message: 'OK' } 형태로 감싸주는 인터셉터
 * 에러 상황은 별도의 글로벌 에러 미들웨어에서 처리됨
 */
@Service()
@Interceptor()
export class GlobalResponseInterceptor implements InterceptorInterface {
  intercept(action: Action, content: any) {
    // 이미 (data, message) 구조라면 그대로 반환하거나,
    // 반환 구조 커스터마이징 하고 싶으면 여기서 처리
    // if (content && (content.data || content.message)) {
    //   return content;
    // }

    return content;
  }
}
