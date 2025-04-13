// src/middlewares/GlobalErrorHandler.ts
import {
  ExpressErrorMiddlewareInterface,
  Middleware,
} from 'routing-controllers';
import { Service } from 'typedi';
import { Request, Response } from 'express';

/**
 * Controller 혹은 Service에서 throw된 예외를 일괄적으로 처리해주는 전역 에러 미들웨어
 */
@Service()
@Middleware({ type: 'after' })
export class GlobalErrorHandler implements ExpressErrorMiddlewareInterface {
  error(error: any, request: Request, response: Response) {
    // 로깅 처리 (winston 등)
    console.error('[GlobalErrorHandler]', error);

    // routing-controllers의 HttpError를 상속하거나
    // 커스텀 에러 클래스에 따라 다른 상태 코드를 매핑할 수 있음
    const statusCode = error.httpCode || 404;
    return response.status(statusCode).json({
      message: error.message || 'Bad Request',
      data: null,
    });
  }
}