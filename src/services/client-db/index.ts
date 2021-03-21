import { inject, injectable } from 'inversify';
import DataSource from '../../interfaces/data-source';
import Client from '../../interfaces/models/client';
import Types from '../../types';
import Orm from './orm-interface';
import errorObject from '../../utils/error-object';

@injectable()
export default class ClientDbService implements DataSource<Client> {
  constructor(@inject(Types.ClientOrm) private ClientOrm: Orm) {}

  async create(params: Partial<Client>) {
    try {
      return await this.ClientOrm.create(params);
    } catch (err) {
      throw errorObject(err);
    }
  }

  async find(opts: any) {
    try {
      return await this.ClientOrm.findAll(opts);
    } catch (err) {
      throw errorObject(err);
    }
  }

  async findOne(opts: any) {
    try {
      return await this.ClientOrm.findOne(opts);
    } catch (err) {
      throw errorObject(err);
    }
  }

  async update(values: Partial<Client>, opts: any) {
    try {
      return await this.ClientOrm.update(values, { ...opts, returning: true });
    } catch (err) {
      throw errorObject(err);
    }
  }
}
