import 'reflect-metadata';
import express from 'express';
import { setExpress } from './loader/express';

const app = express();
async function startServer(){
  setExpress(app);
  const PORT = process.env.PORT || 3001;

  app.listen(PORT, ()=>{
    console.log(`start ${PORT}`);
  });
}
startServer();

