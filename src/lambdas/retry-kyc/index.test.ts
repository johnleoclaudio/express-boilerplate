import 'reflect-metadata';
import * as lambdaModule from './index';
import Database from '../../db/index';

import configFile from 'config';

import Umzug = require('umzug');
import container from '../../index';
import Types from '../../types';

const handler = lambdaModule as any;
const { retryKyc } = handler;

const config = {
  migrations: {
    params: [Database.getQueryInterface(), Database],
    path: 'seeders',
  },
};

const umzug = new Umzug(config);

const mockEmailService = {
  execute: jest.fn(),
};

describe('RetryKyc', () => {
  beforeEach(async () => {
    await umzug.up();
  });

  afterEach(async () => {
    await umzug.down({ to: 0 });
  });

  it('Retry KYC', async () => {
    container.rebind(Types.EmailService).toConstantValue(mockEmailService);
    mockEmailService.execute.mockResolvedValue({});

    const params = {
      userId: 1,
      remarks: 'Hello World',
      fields: ['last_name', 'first_name'],
    };

    const event = {
      body: JSON.stringify(params),
      headers: {
        Authorization: 'cs_access_token',
      },
      pathParameters: {
        type: 'bond',
        group: 'admin',
      },
    };

    const res = await retryKyc(event);
    const { data } = JSON.parse(res.body);

    expect(data.retryKyc).toBeTruthy();
  });

  it('Retry KYC Failed, user is already KYC Approved', async () => {
    container.rebind(Types.EmailService).toConstantValue(mockEmailService);
    mockEmailService.execute.mockResolvedValue({});
    const mockAdminCheckToken = {
      execute: jest.fn(),
    };
    container
      .rebind(Types.AdminCheckToken)
      .toConstantValue(mockAdminCheckToken);
    mockAdminCheckToken.execute.mockResolvedValue({
      owner: {
        id: 1,
        role: 'cs_maker',
      },
    });

    const params = {
      userId: 9,
      remarks: 'Hello World',
      fields: ['last_name', 'first_name'],
    };

    const event = {
      body: JSON.stringify(params),
      headers: {
        Authorization: 'cs_access_token',
      },
      pathParameters: {
        type: 'bond',
        group: 'admin',
      },
    };

    const res = await retryKyc(event);
    const { data } = JSON.parse(res.body);

    expect(data.retryKyc).toBeTruthy();
  });
});
