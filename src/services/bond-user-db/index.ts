import { inject, injectable } from 'inversify';
import DataSource from '../../interfaces/data-source';
import BondUser from '../../interfaces/models/bond-user';
import Types from '../../types';
import Orm from './orm-interface';
import errorObject from '../../utils/error-object';
import BondUserDataSource from './bond-user-source';

@injectable()
export default class BondUserDbService implements BondUserDataSource {
  constructor(@inject(Types.BondUserOrm) private bondUserOrm: Orm) {}

  async create(params: Partial<BondUser>) {
    try {
      return await this.bondUserOrm.create(params);
    } catch (err) {
      throw errorObject(err);
    }
  }

  async find(opts: any) {
    try {
      return await this.bondUserOrm.findAll(opts);
    } catch (err) {
      throw errorObject(err);
    }
  }

  async findOne(opts: any) {
    try {
      return await this.bondUserOrm.findOne(opts);
    } catch (err) {
      throw errorObject(err);
    }
  }

  async update(values: Partial<BondUser>, opts: any) {
    try {
      return await this.bondUserOrm.update(values, {
        ...opts,
        returning: true,
      });
    } catch (err) {
      throw errorObject(err);
    }
  }

  async findAndCountAll(opts: any) {
    try {
      return await this.bondUserOrm.findAndCountAll(opts);
    } catch (err) {
      throw errorObject(err);
    }
  }

  async count(opts: any) {
    try {
      return await this.bondUserOrm.count(opts);
    } catch (err) {
      throw errorObject(err);
    }
  }

  async bulkUpdate(params: any, opts: any, identifiers: Array<string>) {
    try {
      const response = await this.bondUserOrm.bulkCreate(params, {
        ...opts,
        updateOnDuplicate: identifiers,
      });
      return response;
    } catch (err) {
      throw errorObject(err);
    }
  }
}
