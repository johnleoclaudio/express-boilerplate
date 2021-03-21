import { injectable, inject } from 'inversify';
import config from 'config';
import axios from 'axios';
import http from 'http';

import AbstractExecutable from '../../abstract-executable';
import IParams from './params';
import IResponse from './response';
import schema from './schema';

import Types from '../../types';
import Executable from '../../interfaces/executable';
import ILoggerServiceParams from '../logger/params';

const BASE_URL: string = config.get('notificationService.bondBaseUrl');

const BULK_EMAIL_ENDPOINT: string = config.get(
  'notificationService.endpoints.bulkEmail',
);

const BULK_EMAIL_URL: string = `${BASE_URL}${BULK_EMAIL_ENDPOINT}`;

@injectable()
export default class BulkEmailService extends AbstractExecutable<
  IParams,
  IResponse
> {
  constructor(
    @inject(Types.LoggerService)
    private logger: Executable<ILoggerServiceParams, any>,
  ) {
    super();
    this.schema = schema;
  }

  async run(params: IParams) {
    const loggerParams: ILoggerServiceParams = {
      layer: 'service',
      name: 'email',
      type: 'request',
      message: params,
    };

    this.logger.execute(loggerParams);

    const recipients = params.payload.map(data => {
      return {
        emails: data.recipients,
        replacement_data: JSON.stringify(data.content),
      };
    });

    const sender_email =
      params.type === 'bonds'
        ? 'UnionBank of the Philippines <unionbank@bonds.ph>'
        : 'support@pdax.ph';

    const body = {
      messages: [
        {
          sender_email,
          recipients,
          template_name: params.template,
          default_template_data: params.defaultTemplateData,
        },
      ],
    };

    try {
      const { data }: any = await axios({
        url: BULK_EMAIL_URL,
        data: body,
        method: 'POST',
      });

      this.logger.execute({
        ...loggerParams,
        type: 'response',
        message: {
          data,
        },
      });

      return data;
    } catch (err) {
      console.log('email service error:', err);
      const errString: string =
        http.STATUS_CODES[err.response.status] || 'Something Went Wrong';
      // eslint-disable-next-line prefer-destructuring
      const code = err.response.data.code;
      throw {
        code: `${code}`,
        message: errString,
      };
    }
  }
}
