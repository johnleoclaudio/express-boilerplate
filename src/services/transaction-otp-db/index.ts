import { inject, injectable } from 'inversify';
import DataSource from '../../interfaces/data-source';
import TransactionOtp from '../../interfaces/models/transaction-otp';
import Types from '../../types';
import Orm from './orm-interface';
import errorObject from '../../utils/error-object';

@injectable()
export default class TransactionOtpDbService
  implements DataSource<TransactionOtp> {
  constructor(@inject(Types.TransactionOtpOrm) private transactionOtp: Orm) {}

  async create(params: Partial<TransactionOtp>) {
    try {
      return await this.transactionOtp.create(params);
    } catch (err) {
      throw errorObject(err);
    }
  }

  find(opts: any) {
    return Promise.reject('Unimplemented');
  }

  async findOne(opts: any) {
    try {
      return await this.transactionOtp.findOne(opts);
    } catch (err) {
      throw errorObject(err);
    }
  }

  async update(values: Partial<TransactionOtp>, opts: any) {
    try {
      return await this.transactionOtp.update(values, {
        ...opts,
        returning: true,
      });
    } catch (err) {
      throw errorObject(err);
    }
  }
}
