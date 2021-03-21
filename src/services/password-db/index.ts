import { inject, injectable } from 'inversify';
import DataSource from '../../interfaces/data-source';
import Password from '../../interfaces/models/password';
import Types from '../../types';
import Orm from './orm-interface';
import errorObject from '../../utils/error-object';

@injectable()
export default class PasswordDbService implements DataSource<Password> {
  constructor(@inject(Types.PasswordOrm) private passwordOrm: Orm) {}

  async create(params: Partial<Password>) {
    try {
      return await this.passwordOrm.create(params);
    } catch (err) {
      throw errorObject(err);
    }
  }

  async find(opts: any) {
    try {
      return await this.passwordOrm.findAll(opts);
    } catch (err) {
      throw errorObject(err);
    }
  }

  async findOne(opts: any) {
    try {
      return await this.passwordOrm.findOne(opts);
    } catch (err) {
      throw errorObject(err);
    }
  }

  async update(values: Partial<Password>, opts: any) {
    try {
      return await this.passwordOrm.update(values, {
        ...opts,
        returning: true,
      });
    } catch (err) {
      throw errorObject(err);
    }
  }
}
