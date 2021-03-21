import 'reflect-metadata';
import _ from 'lodash';
import * as lambdaModule from './index';
import Database from '../../db/index';
import container from '../../index';
import Types from '../../types';

import Umzug = require('umzug');

const { createOtp } = lambdaModule as any;

const config = {
  migrations: {
    params: [Database.getQueryInterface(), Database],
    path: 'seeders',
  },
};

const umzug = new Umzug(config);

describe('CreateOtp', () => {
  beforeEach(async () => {
    await umzug.up();
  });

  afterEach(async () => {
    await umzug.down({ to: 0 });
  });

  const params = {
    deviceId: 'device_id',
    deviceName: 'Oneplus GM1900',
    identifier: '639274728171',
  };

  const event = {
    body: JSON.stringify(params),
    pathParameters: {
      type: 'bond_user',
    },
  };

  // TODO: Check assert
  it('works', async () => {
    const mockSms = {
      execute: jest.fn(),
    };
    const mockSmsRes = { result: true };

    container.rebind(Types.SmsService).toConstantValue(mockSms);
    mockSms.execute.mockResolvedValue(mockSmsRes);
    const res = await createOtp(event);

    const { data } = JSON.parse(res.body);

    console.log('da data:', data);
    // expect(data.accessToken).toBeTruthy();
    // expect(data.refreshToken).toBeTruthy();
  });

  it('throws an error when reached the max otp attempt', async () => {
    const mockSms = {
      execute: jest.fn(),
    };
    const mockSmsRes = { result: true };

    container.rebind(Types.SmsService).toConstantValue(mockSms);
    mockSms.execute.mockResolvedValue(mockSmsRes);
    const params = {
      deviceId: 'device_id',
      deviceName: 'Oneplus GM1900',
      identifier: '639274728171',
    };

    const event = {
      body: JSON.stringify(params),
      pathParameters: {
        type: 'bond_user',
      },
    };
    const res = await Promise.all([
      await createOtp(event), // 1
      await createOtp(event), // 2
      await createOtp(event), // 3
      await createOtp(event), // 4
      await createOtp(event), // 5
      await createOtp(event),
    ]);

    const response = res[res.length - 1];

    const body = JSON.parse(response.body);

    expect(body.data.code).toEqual('AccountOtpBlocked');
    expect(body.data.message).toEqual('Account OTP is blocked');
  }, 500000);
});
