import { Sequelize } from "sequelize";
import config from "config";

const { username, database: dbName, password, ...dbConfig } = config.get(
  "database"
);

export default new Sequelize(dbName, username, password, dbConfig);
