import { inject, injectable } from 'inversify';
import DataSource from '../../interfaces/data-source';
import UserKeyPair from '../../interfaces/models/user-key-pair';
import Types from '../../types';
import Orm from './orm-interface';
import errorObject from '../../utils/error-object';

@injectable()
export default class UserKeyPairDbService implements DataSource<UserKeyPair> {
  constructor(@inject(Types.UserKeyPairOrm) private userKeyPairOrm: Orm) {}

  async create(params: Partial<UserKeyPair>) {
    try {
      return await this.userKeyPairOrm.create(params);
    } catch (err) {
      throw errorObject(err);
    }
  }

  async find(opts: any) {
    try {
      return await this.userKeyPairOrm.findAll(opts);
    } catch (err) {
      throw errorObject(err);
    }
  }

  async findOne(opts: any) {
    try {
      return await this.userKeyPairOrm.findOne(opts);
    } catch (err) {
      throw errorObject(err);
    }
  }

  async update(values: Partial<UserKeyPair>, opts: any) {
    try {
      return await this.userKeyPairOrm.update(values, {
        ...opts,
        returning: true,
      });
    } catch (err) {
      throw errorObject(err);
    }
  }
}
