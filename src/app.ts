import express from 'express';
import {Request, Response, NextFunction} from 'express';
import cors from 'cors';
import morgan from 'morgan';
import 'reflect-metadata';
import { setExpress } from './loader/express';

const app = express();
app.use(cors());
app.use(morgan('dev'));


async function startServer(){
  setExpress(app);
  const PORT = process.env.PORT || 3000;
  // 에러 핸들러 미들웨어를 추가합니다.
  app.use((error: any, request: Request, response: Response, next: NextFunction) => {
    console.error(error.stack);
    response.status(500).send('Something broke!');
  });

  app.listen(PORT, ()=>{
    console.log(`start ${PORT}`);
  });
}
startServer();

