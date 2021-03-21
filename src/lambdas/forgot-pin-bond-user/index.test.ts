import 'reflect-metadata';
import container from '../../index';
import Types from '../../types';
import * as lambdaModule from './index';
import Database from '../../db/index';

import Umzug = require('umzug');

const { forgotPinBondUser } = lambdaModule as any;

const config = {
  migrations: {
    params: [Database.getQueryInterface(), Database],
    path: 'seeders',
  },
};

const umzug = new Umzug(config);

describe('forgotPinBondUser', () => {
  beforeEach(async () => {
    await umzug.up();
  });

  afterEach(async () => {
    await umzug.down({ to: 0 });
  });

  const params = {
    identifier: '639663659242',
    deviceId: 'deviceId',
    deviceName: 'deviceName',
  };

  const event = {
    body: JSON.stringify(params),
  };

  it.only('successfully requests for a change of pin', async () => {
    const mockSms = {
      execute: jest.fn(),
    };
    const mockSmsRes = { result: true };

    container.rebind(Types.SmsService).toConstantValue(mockSms);
    mockSms.execute.mockResolvedValue(mockSmsRes);

    const mockEmail = {
      execute: jest.fn(),
    };
    const mockEmailRes = { result: true };

    container.rebind(Types.EmailService).toConstantValue(mockEmail);
    mockEmail.execute.mockResolvedValue(mockEmailRes);

    const res = await forgotPinBondUser(event);
    const { status } = JSON.parse(res.body);

    expect(res).toEqual(1);
    expect(status).toEqual('success');
    expect(mockSms.execute).toHaveBeenCalled();
  });

  it('throws an error when reached the max otp request attempt', async () => {
    const mockSms = {
      execute: jest.fn(),
    };
    const mockSmsRes = { result: true };

    container.rebind(Types.SmsService).toConstantValue(mockSms);
    mockSms.execute.mockResolvedValue(mockSmsRes);

    const params = {
      identifier: '09222222222',
      deviceId: 'deviceId',
      deviceName: 'deviceName',
    };

    const event = {
      body: JSON.stringify(params),
    };

    const res = await Promise.all([
      await forgotPinBondUser(event), // 1
      await forgotPinBondUser(event), // 2
      await forgotPinBondUser(event), // 3
      await forgotPinBondUser(event), // 4
      await forgotPinBondUser(event), // 5
      await forgotPinBondUser(event),
    ]);

    const response = res[res.length - 1];

    const body = JSON.parse(response.body);

    expect(body.data.code).toEqual('AccountOtpBlocked');
    expect(body.data.message).toEqual('Account OTP is blocked');
  }, 500000);
});
