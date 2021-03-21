import { inject, injectable } from 'inversify';
import DataSource from '../../interfaces/data-source';
import AdminAction from '../../interfaces/models/admin-action';
import Types from '../../types';
import Orm from './orm-interface';
import errorObject from '../../utils/error-object';

@injectable()
export default class AdminActionDbService implements DataSource<AdminAction> {
  constructor(@inject(Types.AdminActionOrm) private adminActionOrm: Orm) {}

  async create(params: Partial<AdminAction>) {
    try {
      return await this.adminActionOrm.create(params);
    } catch (err) {
      throw errorObject(err);
    }
  }

  async find(opts: any) {
    try {
      return await this.adminActionOrm.findAll(opts);
    } catch (err) {
      throw errorObject(err);
    }
  }

  async findOne(opts: any) {
    try {
      return await this.adminActionOrm.findOne(opts);
    } catch (err) {
      throw errorObject(err);
    }
  }

  async update(values: Partial<AdminAction>, opts: any) {
    try {
      return await this.adminActionOrm.update(values, {
        ...opts,
        returning: true,
      });
    } catch (err) {
      throw errorObject(err);
    }
  }

  async bulkCreate(params: any, opts: any) {
    try {
      const response = await this.adminActionOrm.bulkCreate(params, opts);
      return response;
    } catch (err) {
      throw errorObject(err);
    }
  }

  async bulkUpdate(params: any, opts: any, identifiers: Array<string>) {
    try {
      const response = await this.adminActionOrm.bulkCreate(params, {
        ...opts,
        updateOnDuplicate: identifiers,
      });
      return response;
    } catch (err) {
      throw errorObject(err);
    }
  }
}
