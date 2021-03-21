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
import { createVerifyAccountTemplate } from '../../services/email-service/templates/templates';

const EMAIL_VERIFICATION_DURATION: number = config.get(
  'application.emailVerificationDuration',
);
const BASE_URL: string = config.get('redirBonds.baseUrl');
const ENDPOINT: string = config.get('redirBonds.endpoints.verify');

const VERIFICATION_URL: string = BASE_URL + ENDPOINT;

@injectable()
export default class BondUserRegisterObserver extends AbstractExecutable<
  Params,
  any
> {
  constructor(
    @inject(Types.EmailService)
    private emailService: Executable<EmailServiceParams, any>,
    @inject(Types.VerificationCodeDataSource)
    private verCodeDataSource: DataSource<VerificationCode>,
  ) {
    super();
    this.schema = schema;
  }

  async run({ ownerId, secureId, email }: Params) {
    const { code } = await this.verCodeDataSource.create({
      ownerId,
      ownerType: 'bond_user',
      expiresAt: addHours(new Date(), EMAIL_VERIFICATION_DURATION),
    });

    const callToActionLink = `${VERIFICATION_URL}?code=${code}&user=${secureId}`;

    await this.emailService.execute({
      email,
      subject: 'Email Verification',
      content: createVerifyAccountTemplate(callToActionLink),
      type: 'bonds',
    });
  }
}
