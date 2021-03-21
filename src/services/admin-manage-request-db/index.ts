import { inject, injectable } from 'inversify';
import DataSource from '../../interfaces/data-source';
import Request from '../../interfaces/models/admin-manage-request';
import Types from '../../types';
import Orm from './orm-interface';
import errorObject from '../../utils/error-object';

@injectable()
export default class AdminManageRequestDbService
  implements DataSource<Request> {
  constructor(@inject(Types.AdminManageRequestOrm) private orm: Orm) {}

  async create(params: Partial<Request>) {
    try {
      return await this.orm.create(params);
    } catch (err) {
      throw errorObject(err);
    }
  }

  async find(opts: any) {
    try {
      return await this.orm.findAll(opts);
    } catch (err) {
      throw errorObject(err);
    }
  }

  async findOne(opts: any) {
    try {
      return await this.orm.findOne(opts);
    } catch (err) {
      throw errorObject(err);
    }
  }

  async update(values: Partial<Request>, opts: any) {
    try {
      return await this.orm.update(values, {
        ...opts,
        returning: true,
      });
    } catch (err) {
      throw errorObject(err);
    }
  }

  async findAndCountAll(opts: any) {
    try {
      return await this.orm.findAndCountAll(opts);
    } catch (err) {
      throw errorObject(err);
    }
  }
}
