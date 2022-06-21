import environment from './configs/environment';
import express from 'express';
import chalk from 'chalk';
import logger from 'morgan';
import cors from 'cors';
import flash from 'express-flash';
import errorsMiddleware from './middlewares/errors';
import { v1Routes } from './controllers';
import session from 'express-session';

class App {
  constructor() {
    this.app = express();
    this.app.use(logger('dev', { skip: (req, res) => environment.nodeEnv === 'test' }));
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.set('view engine', 'ejs');
    this.app.use(express.static('./node_modules/socket.io-client/dist'));
    this.app.use(express.static('./src/public/assets'));
    this.app.set('views', './src/public/views/pages');
    this.app.use(session(environment.session));
    this.app.use(flash());
    this.app.use(cors());
    this.setRoutes();
  }
  setRoutes() {
    this.app.use('/v1', v1Routes);
    this.app.use(errorsMiddleware);
  }
  getApp() {
    return this.app;
  }
  listen() {
    const { port } = environment;
    return this.app.listen(port, () => {
      console.log(chalk.yellowBright.inverse.bold(`Server is Running on Port : ${port}!`));
    });
  }
}

export default App;
