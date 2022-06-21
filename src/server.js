import './configs';
import environment from './configs/environment';
import Database from './database';
import dbConfig from './configs/database';
import SocketApp from './utils/socketApp';

(async () => {
  try {
    // Connect to the Database
    const db = new Database(environment.nodeEnv, dbConfig);
    await db.connect();

    // const initializePassport = require('./configs/passport-config').default;
    // initializePassport(passport);

    const App = require('./app').default;
    const app = new App();
    const expressServer = app.listen();
    new SocketApp(expressServer);
  } catch (error) {
    console.error('Something went wrong when initializing the server:\n', error.stack);
  }
})();
