import 'reflect-metadata';
import _ from 'lodash';
import * as lambdaModule from './index';
import Database from '../../db/index';

import Umzug = require('umzug');

const { checkOtp } = lambdaModule as any;

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
    const res = await checkOtp(event);

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
    const res = await checkOtp(event);

    const { data } = JSON.parse(res.body);

    expect(data.code).toEqual('InvalidCheckOtpRequest');
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
    const res = await checkOtp(event);

    const { data } = JSON.parse(res.body);

    expect(data.code).toEqual('InvalidCheckOtpRequest');
  });

  it('throws an error when reached the max otp attempt', async () => {
    const params = {
      deviceId: 'device_id',
      identifier: '639274728171',
      otp: '123457',
    };

    const event = {
      body: JSON.stringify(params),
      pathParameters: {
        type: 'bond_user',
      },
    };

    const res = await Promise.all([
      await checkOtp(event), // 1
      await checkOtp(event), // 2
      await checkOtp(event), // 3
      await checkOtp(event), // 4
      await checkOtp(event), // 5
      await checkOtp(event),
    ]);

    const response = res[res.length - 1];

    const body = JSON.parse(response.body);

    expect(body.data.code).toEqual('AccountOtpBlocked');
    expect(body.data.message).toEqual('Account OTP is blocked');
  }, 500000);
});
