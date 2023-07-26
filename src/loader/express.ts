import express from "express";
import { useExpressServer } from 'routing-controllers';
import path from 'path';

export async function setExpress(app: express.Application) {

  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  useExpressServer(app, {
    controllers: [path.join(`${__dirname}/../controller/*.ts`)],
  });
}