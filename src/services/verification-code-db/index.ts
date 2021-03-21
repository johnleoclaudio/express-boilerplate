import { inject, injectable } from 'inversify';
import DataSource from '../../interfaces/data-source';
import VerificationCode from '../../interfaces/models/verification-code';
import Types from '../../types';
import Orm from './orm-interface';
import errorObject from '../../utils/error-object';

@injectable()
export default class VerificationCodeDbService
  implements DataSource<VerificationCode> {
  constructor(
    @inject(Types.VerificationCodeOrm) private verificationCodeOrm: Orm,
  ) {}

  async create(params: Partial<VerificationCode>) {
    try {
      return await this.verificationCodeOrm.create(params);
    } catch (err) {
      throw errorObject(err);
    }
  }

  find(opts: any) {
    return Promise.reject('Unimplemented');
  }

  async findOne(opts: any) {
    try {
      return await this.verificationCodeOrm.findOne(opts);
    } catch (err) {
      throw errorObject(err);
    }
  }

  async update(values: Partial<VerificationCode>, opts: any) {
    try {
      return await this.verificationCodeOrm.update(values, {
        ...opts,
        returning: true,
      });
    } catch (err) {
      throw errorObject(err);
    }
  }
}
