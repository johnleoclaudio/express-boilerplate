import 'reflect-metadata';
import _ from 'lodash';
import * as lambdaModule from './index';
import Database from '../../db/index';

import Umzug = require('umzug');

const { checkOtpForgotPinBondUser } = lambdaModule as any;

const config = {
  migrations: {
    params: [Database.getQueryInterface(), Database],
    path: 'seeders',
  },
};

const umzug = new Umzug(config);

describe('RefreshToken', () => {
  beforeEach(async () => {
    await umzug.up();
  });

  afterEach(async () => {
    await umzug.down({ to: 0 });
  });

  it('works', async () => {
    const params = {
      deviceId: 'device_id',
      identifier: '639274728171',
      otp: '123456',
    };

    const event = {
      body: JSON.stringify(params),
      pathParameters: {
        type: 'bond_user',
      },
    };
    const res = await checkOtpForgotPinBondUser(event);

    const { data } = JSON.parse(res.body);

    expect(data.result).toBeTruthy();
  });

  it('OTP does not exist', async () => {
    const params = {
      deviceId: 'device_id',
      identifier: '639274728171',
      otp: '456456',
    };

    const event = {
      body: JSON.stringify(params),
      pathParameters: {
        type: 'bond_user',
      },
    };
    const res = await checkOtpForgotPinBondUser(event);

    const { data } = JSON.parse(res.body);

    expect(data.code).toEqual('InvalidCheckOtpForgotPinRequest');
  });

  it('OTP has expired', async () => {
    const params = {
      deviceId: 'device_id',
      identifier: '639274728171',
      otp: '654321',
    };

    const event = {
      body: JSON.stringify(params),
      pathParameters: {
        type: 'bond_user',
      },
    };
    const res = await checkOtpForgotPinBondUser(event);

    const { data } = JSON.parse(res.body);

    expect(data.code).toEqual('InvalidCheckOtpForgotPinRequest');
  });
});
