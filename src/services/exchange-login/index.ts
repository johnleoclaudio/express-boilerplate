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

const BASE_URL: string = config.get('exchange.baseUrl');
const LOGIN_ENDPOINT: string = config.get('exchange.endpoints.login');
const URL: string = `${BASE_URL}${LOGIN_ENDPOINT}`;

@injectable()
export default class ExchangeLoginService extends AbstractExecutable<
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
    const { username, password, deviceId, headers, otp } = params;
    const loggerParams: ILoggerServiceParams = {
      layer: 'service',
      name: 'exchange-login',
      type: 'request',
      message: { username, deviceId, headers, otp },
    };
    this.logger.execute(loggerParams);

    const body = {
      username,
      password,
      api_key_alias: deviceId,
    };
    if (otp) {
      body['otp'] = otp;
    }

    try {
      // const loginResponse: any = await axios.post(
      //   URL,
      //   // body,
      //   {
      //     username,
      //     password,
      //     api_key_alias: deviceId,
      //     // otp,
      //   },
      //   {
      //     headers: {
      //       'Content-Type': 'application/json'
      //     },
      //   },
      // );

      // console.log('dares:', loginResponse);
      const {
        data,
        config,
        status,
        statusText,
        headers: headerResponse,
      }: any = await axios.post(
        URL,
        body,
        // {
        //   username,
        //   password,
        //   api_key_alias: deviceId,
        //   // otp,
        // },
        {
          headers,
        },
      );

      delete config['data'];

      // const loginResponse: any = await axios.post(
      //   URL,
      //   {
      //     username,
      //     password,
      //     api_key_alias: deviceId,
      //     otp,
      //   },
      //   {
      //     headers,
      //   },
      // );

      this.logger.execute({
        ...loggerParams,
        type: 'response',
        message: {
          config,
          status,
          statusText,
          headerResponse,
          // data,
        },
      });

      // return {
      //   apiKey: loginResponse.data.data.api_key,
      //   apiSecret: loginResponse.data.data.api_secret,
      // };

      return {
        apiKey: data.data.api_key,
        apiSecret: data.data.api_secret,
      };
    } catch (err) {
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
