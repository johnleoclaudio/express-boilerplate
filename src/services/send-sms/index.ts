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

const BASE_URL: string = config.get('nexmo.baseUrl');
const SMS_ENDPOINT: string = config.get('nexmo.endpoints.sms');
const API_KEY = config.get('application.smsApiKey');
const API_SECRET = config.get('application.smsApiSecret');
const URL: string = `${BASE_URL}${SMS_ENDPOINT}`;
const LOCAL_API_KEY = config.get('application.localSmsApiKey');
const LOCAL_BASE_URL: string = config.get('semaphore.baseUrl');
const LOCAL_SMS_ENDPOINT: string = config.get('semaphore.endpoints.sms');
const LOCAL_URL: string = `${LOCAL_BASE_URL}${LOCAL_SMS_ENDPOINT}`;

@injectable()
export default class SmsService extends AbstractExecutable<IParams, IResponse> {
  constructor(
    @inject(Types.LoggerService)
    private logger: Executable<ILoggerServiceParams, any>,
  ) {
    super();
    this.schema = schema;
  }

  async run(params: IParams) {
    const { message, to } = params;
    const loggerParams: ILoggerServiceParams = {
      layer: 'service',
      name: 'sendSms',
      type: 'request',
      message: { params },
    };
    this.logger.execute(loggerParams);
    // const from = to.substring(0, 1) == '1' ? '18602487329' : 'PDAX';
    const from = to.substring(0, 1) == '1' ? '18602487329' : 'BONDS PH';
    // const omegalul = to.substring(0, 2) == '63';
    let smsUrl = URL;

    let body: any = {
      api_key: API_KEY,
      api_secret: API_SECRET,
      from,
      to,
      text: message,
    };

    if (to.substring(0, 2) == '63') {
      console.log('local body'); // TODO: Nicco - Remove
      smsUrl = LOCAL_URL;
      body = {
        apikey: LOCAL_API_KEY,
        number: to,
        sendername: 'BondsPH',
        message,
      };

      console.log({ smsUrl, body });
    }

    try {
      const {
        data,
        config,
        status,
        statusText,
        headers: headerResponse,
      }: any = await axios.post(smsUrl, body, {
        headers: {},
      });

      this.logger.execute({
        ...loggerParams,
        type: 'response',
        message: {
          config,
          status,
          statusText,
          headerResponse,
          data,
        },
      });
      console.log('da res:', data);
      return {
        response: data,
      };
    } catch (err) {
      try {
        // nexmo here
        const body = {
          api_key: API_KEY,
          api_secret: API_SECRET,
          from,
          to,
          text: message,
        };
        const {
          data,
          config,
          status,
          statusText,
          headers: headerResponse,
        }: any = await axios.post(URL, body, {
          headers: {},
        });

        this.logger.execute({
          ...loggerParams,
          type: 'response',
          message: {
            config,
            status,
            statusText,
            headerResponse,
            data,
          },
        });
      } catch (err) {
        console.log('da err:', err);
        this.logger.execute({
          ...loggerParams,
          type: 'response',
          message: {
            data: err.response.data,
            config: err.response.config,
            status: err.response.status,
            statusText: err.response.statusText,
            headers: err.response.headers,
          },
        });
        const errString: string =
          http.STATUS_CODES[err.response.status] || 'Something Went Wrong';
        // const code = errString.split(' ').join('');
        // throw {
        //   code: `${code}Error`,
        //   message: errString,
        // };
        const code = err.response.data.code;
        throw {
          code: `${code}`,
          message: errString,
        };
      }
    }
  }
}
