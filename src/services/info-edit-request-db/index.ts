import { inject, injectable } from 'inversify';
import DataSource from '../../interfaces/data-source';
import InfoEditRequest from '../../interfaces/models/info-edit-requests';
import Types from '../../types';
import Orm from './orm-interface';
import errorObject from '../../utils/error-object';

@injectable()
export default class InfoEditRequestDbService
  implements DataSource<InfoEditRequest> {
  constructor(@inject(Types.InfoEditRequestOrm) private infoEditRequest: Orm) {}

  async create(params: Partial<InfoEditRequest>, opts: any) {
    try {
      return await this.infoEditRequest.create(params, opts);
    } catch (err) {
      throw errorObject(err);
    }
  }

  async find(opts: any) {
    try {
      return await this.infoEditRequest.findAll(opts);
    } catch (err) {
      throw errorObject(err);
    }
  }

  async findOne(opts: any) {
    try {
      return await this.infoEditRequest.findOne(opts);
    } catch (err) {
      throw errorObject(err);
    }
  }

  async update(values: Partial<InfoEditRequest>, opts: any) {
    try {
      return await this.infoEditRequest.update(values, {
        ...opts,
        returning: true,
      });
    } catch (err) {
      throw errorObject(err);
    }
  }

  async findAndCountAll(opts: any) {
    try {
      return await this.infoEditRequest.findAndCountAll(opts);
    } catch (err) {
      throw errorObject(err);
    }
  }

  async count(opts: any) {
    try {
      return await this.infoEditRequest.count(opts);
    } catch (err) {
      throw errorObject(err);
    }
  }
}
