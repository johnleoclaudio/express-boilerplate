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
const EMAIL_RETRY_COUNT: number = config.get('application.emailRetry');

@injectable()
export default class EmailService extends AbstractExecutable<
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

    const { type = '' } = params;
    const BASE_URL: string =
      type === 'bonds'
        ? config.get('notificationService.bondBaseUrl')
        : config.get('notificationService.baseUrl');

    const EMAIL_ENDPOINT: string = config.get(
      'notificationService.endpoints.email',
    );
    const URL: string = `${BASE_URL}${EMAIL_ENDPOINT}`;

    try {
      axios.interceptors.response.use(
        response => response,
        error => {
          throw error;
        },
      );

      for (let index = 0; index < EMAIL_RETRY_COUNT; index++) {
        try {
          const { data }: any = await axios({
            url: URL,
            data: params,
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
          if (index >= EMAIL_RETRY_COUNT) {
            throw err;
          }
          // else silent error and retry
        }
      }

      // const { data }: any = await axios({
      //   url: URL,
      //   data: params,
      //   method: 'POST',
      // });

      // this.logger.execute({
      //   ...loggerParams,
      //   type: 'response',
      //   message: {
      //     data,
      //   },
      // });

      // return data;
    } catch (err) {
      console.log('email service error:', err);
      const errString: string =
        http.STATUS_CODES[err.response.status] || 'Something Went Wrong';
      const code = err.response.data.code;
      throw {
        code: `${code}`,
        message: errString,
      };
    }
  }
}
