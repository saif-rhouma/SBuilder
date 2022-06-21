import { Sequelize } from 'sequelize';
import { registerModels } from '../models';
import cls from 'cls-hooked';
class Database {
  constructor(environment, dbConfig) {
    this.environment = environment;
    this.dbConfig = dbConfig;
    this.isTestEnvironment = this.environment === 'test';
  }
  getConnection() {
    return this.dbConfig[this.environment];
  }

  async connect() {
    // Set up The namespace for transactions
    // const namespace = cls.createNamespace('transaction-namespace');
    // Sequelize.useCLS(namespace);

    const connectionString = this.getConnection();
    this.connection = new Sequelize({ ...connectionString, logging: this.isTestEnviroment ? false : console.log });
    if (!this.isTestEnviroment) {
      console.log('Connection has been established successfully');
    }
    registerModels(this.connection);
    await this.sync();
  }
  async sync() {
    await this.connection.sync({
      force: this.isTestEnviroment,
      logging: false,
    });

    if (!this.isTestEnviroment) {
      console.log('Models synchronized successfully');
    }
  }

  async disconnect() {
    await this.connection.close();
  }
}

export default Database;
