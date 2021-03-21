import { inject, injectable } from 'inversify';
import DataSource from '../../interfaces/data-source';
import AdditionalInfo from '../../interfaces/models/additional-info';
import Types from '../../types';
import Orm from './orm-interface';
import errorObject from '../../utils/error-object';

@injectable()
export default class AdditionalInfoDbService
  implements DataSource<AdditionalInfo> {
  constructor(
    @inject(Types.AdditionalInfoOrm) private additionalInfoOrm: Orm,
  ) {}

  async create(params: Partial<AdditionalInfo>) {
    try {
      return await this.additionalInfoOrm.create(params);
    } catch (err) {
      throw errorObject(err);
    }
  }

  async find(opts: any) {
    try {
      return await this.additionalInfoOrm.findAll(opts);
    } catch (err) {
      throw errorObject(err);
    }
  }

  async findOne(opts: any) {
    try {
      return await this.additionalInfoOrm.findOne(opts);
    } catch (err) {
      throw errorObject(err);
    }
  }

  async update(values: Partial<AdditionalInfo>, opts: any) {
    try {
      return await this.additionalInfoOrm.update(values, {
        ...opts,
        returning: true,
      });
    } catch (err) {
      throw errorObject(err);
    }
  }

  async count(opts: any) {
    try {
      return await this.additionalInfoOrm.count(opts);
    } catch (err) {
      throw errorObject(err);
    }
  }
}
