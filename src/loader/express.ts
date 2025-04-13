import express from "express";
import morgan from "morgan";
import cors from 'cors';
import { useExpressServer, useContainer } from 'routing-controllers';
import { Container } from "typedi";
import { GlobalErrorHandler } from "../middlewares/global-error-handler";
import { GlobalResponseInterceptor } from "../middlewares/global-response-interceptor";
import { UserController } from "../features/user/user.controller";
import { AppController } from "../app.controller";

export async function setExpress(app: express.Application) {
  useContainer(Container);
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(cors());
  app.use(morgan('dev'));
  useExpressServer(app, {
    controllers: [UserController, AppController],
    interceptors: [GlobalResponseInterceptor],
    middlewares: [GlobalErrorHandler]
  });
}