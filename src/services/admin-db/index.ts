import { inject, injectable } from 'inversify';
import DataSource from '../../interfaces/data-source';
import Admin from '../../interfaces/models/admin';
import Types from '../../types';
import Orm from './orm-interface';
import errorObject from '../../utils/error-object';

@injectable()
export default class AdminDbService implements DataSource<Admin> {
  constructor(@inject(Types.AdminOrm) private adminOrm: Orm) {}

  async create(params: Partial<Admin>) {
    try {
      return await this.adminOrm.create(params);
    } catch (err) {
      throw errorObject(err);
    }
  }

  async find(opts: any) {
    try {
      return await this.adminOrm.findAll(opts);
    } catch (err) {
      throw errorObject(err);
    }
  }

  async findOne(opts: any) {
    try {
      return await this.adminOrm.findOne(opts);
    } catch (err) {
      throw errorObject(err);
    }
  }

  async update(values: Partial<Admin>, opts: any) {
    try {
      return await this.adminOrm.update(values, { ...opts, returning: true });
    } catch (err) {
      throw errorObject(err);
    }
  }

  async findAndCountAll(opts: any) {
    try {
      return await this.adminOrm.findAndCountAll(opts);
    } catch (err) {
      throw errorObject(err);
    }
  }
}
