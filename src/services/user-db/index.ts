import { inject, injectable } from 'inversify';
import DataSource from '../../interfaces/data-source';
import User from '../../interfaces/models/user';
import Types from '../../types';
import Orm from './orm-interface';
import errorObject from '../../utils/error-object';

@injectable()
export default class UserDbService implements DataSource<User> {
  constructor(@inject(Types.UserOrm) private userOrm: Orm) {}

  async create(params: Partial<User>) {
    try {
      return await this.userOrm.create(params);
    } catch (err) {
      throw errorObject(err);
    }
  }

  async find(opts: any) {
    try {
      return await this.userOrm.findAll(opts);
    } catch (err) {
      throw errorObject(err);
    }
  }

  async findOne(opts: any) {
    try {
      return await this.userOrm.findOne(opts);
    } catch (err) {
      throw errorObject(err);
    }
  }

  async update(values: Partial<User>, opts: any) {
    try {
      return await this.userOrm.update(values, { ...opts, returning: true });
    } catch (err) {
      throw errorObject(err);
    }
  }
}
