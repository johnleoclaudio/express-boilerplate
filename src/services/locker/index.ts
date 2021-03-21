import { inject, injectable } from 'inversify';
import config from 'config';
import { Sequelize } from 'sequelize';
import Types from '../../types';
import Executable from '../../interfaces/executable';
// const sequelize = require('sequelize');

@injectable()
export default class LockerService implements Executable<any, any> {
  constructor(@inject(Sequelize) private sequelize: any) {}

  execute(params: any, opts: any) {
    if (!params.id) {
      throw {
        error: 'NoIdSetInLock',
        message: 'Send `id` in parameter',
      };
    }
    return this.sequelize.query(`SELECT pg_advisory_xact_lock(${params.id});`, {
      transaction: opts.dbTxn,
    });
  }
}
