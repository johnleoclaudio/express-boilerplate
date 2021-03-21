import { Container } from 'inversify';
import { Sequelize } from 'sequelize';

import Types from '../types';

import Database from './index';
import DbTransaction from './db-transaction';
import SampleOrm from './sample';

import IDbTransaction from '../interfaces/db-transaction';

const container = new Container();

container.bind<Sequelize>(Sequelize).toConstantValue(Database);

container.bind<IDbTransaction>(Types.DbTransaction).to(DbTransaction);

container.bind<SampleOrm>(Types.SampleOrm).toConstructor<SampleOrm>(SampleOrm);

export default container;
