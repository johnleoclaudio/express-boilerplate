import { inject, injectable } from 'inversify';
import DataSource from '../../interfaces/data-source';
import Otp from '../../interfaces/models/otp';
import Types from '../../types';
import Orm from './orm-interface';
import errorObject from '../../utils/error-object';

@injectable()
export default class OtpDbService implements DataSource<Otp> {
  constructor(@inject(Types.OtpOrm) private otpOrm: Orm) {}

  async create(params: Partial<Otp>) {
    try {
      return await this.otpOrm.create(params);
    } catch (err) {
      throw errorObject(err);
    }
  }

  find(opts: any) {
    return Promise.reject('Unimplemented');
  }

  async findOne(opts: any) {
    try {
      return await this.otpOrm.findOne(opts);
    } catch (err) {
      throw errorObject(err);
    }
  }

  async update(values: Partial<Otp>, opts: any) {
    try {
      return await this.otpOrm.update(values, { ...opts, returning: true });
    } catch (err) {
      throw errorObject(err);
    }
  }
}
