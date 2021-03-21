import { Container } from "inversify";
import { Sequelize } from "sequelize";

import Types from "../types";

import Database from "./index";
import DbTransaction from "./db-transaction";
import Sample from "./sample";

import IDbTransaction from "../interfaces/db-transaction";

const container = new Container();

container.bind<Sequelize>(Sequelize).toConstantValue(Database);

container.bind<IDbTransaction>(Types.DbTransaction).to(DbTransaction);

container.bind<Sample>(Types.Sample).toConstructor<Sample>(Sample);

export default container;
