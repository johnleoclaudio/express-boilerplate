import { inject, injectable } from 'inversify';
import DataSource from '../../interfaces/data-source';
import Session from '../../interfaces/models/session';
import Types from '../../types';
import Orm from './orm-interface';
import errorObject from '../../utils/error-object';

@injectable()
export default class SessionDbService implements DataSource<Session> {
  constructor(@inject(Types.SessionOrm) private sessionOrm: Orm) {}

  async create(params: Partial<Session>) {
    try {
      return await this.sessionOrm.create(params);
    } catch (err) {
      throw errorObject(err);
    }
  }

  async find(opts: any) {
    try {
      return await this.sessionOrm.findAll(opts);
    } catch (err) {
      throw errorObject(err);
    }
  }

  async findOne(opts: any) {
    try {
      return await this.sessionOrm.findOne(opts);
    } catch (err) {
      throw errorObject(err);
    }
  }

  async update(values: Partial<Session>, opts: any) {
    try {
      return await this.sessionOrm.update(values, { ...opts, returning: true });
    } catch (err) {
      throw errorObject(err);
    }
  }
}
