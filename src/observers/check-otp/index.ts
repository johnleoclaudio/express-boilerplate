import { injectable, inject } from 'inversify';
import config from 'config';
import { addHours } from 'date-fns';
import Types from '../../types';

import AbstractExecutable from '../../abstract-executable';
import schema from './schema';
import Params from './params';

import DataSource from '../../interfaces/data-source';
import Executable from '../../interfaces/executable';
import VerificationCode from '../../interfaces/models/verification-code';

import EmailServiceParams from '../../services/email-service/params';
import Session from '../../interfaces/models/session';
import Encrypter from '../../interfaces/encrypter';

@injectable()
export default class CheckOtpObserver extends AbstractExecutable<Params, any> {
  constructor(
    @inject(Types.Encrypter) private encrypter: Encrypter,
    @inject(Types.SessionDataSource)
    private sessionDataSource: DataSource<Session>,
  ) {
    super();
    this.schema = schema;
  }

  async run({ ownerId, ownerType, scope }: Params) {
    const expiry = addHours(new Date(), 1);

    const res = await this.sessionDataSource.create({
      accessToken: this.encrypter.encrypt(
        {
          type: 'access',
          timestamp: Number(new Date()),
        },
        { expiresIn: `${1}h` },
      ),

      refreshToken: this.encrypter.encrypt(
        {
          type: 'refresh',
          timestamp: Number(new Date()),
        },
        { expiresIn: `${1}h` },
      ),
      ownerId,
      ownerType,
      scope,
      expiresAt: expiry,
    });
    return res;
  }
}
