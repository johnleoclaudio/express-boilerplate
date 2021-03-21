import 'reflect-metadata';
import _ from 'lodash';
import * as lambdaModule from './index';
import Database from '../../db/index';
import container from '../../index';
import Types from '../../types';

import Umzug = require('umzug');

const handler = lambdaModule as any;
const { adminApproveRejectManageAdminRequest } = handler;

const config = {
  migrations: {
    params: [Database.getQueryInterface(), Database],
    path: 'seeders',
  },
};

const umzug = new Umzug(config);

declare const adminManageRequestCount: number;

describe('adminApproveRejectManageAdminRequest', () => {
  const mockEmailService = {
    execute: jest.fn(),
  };
  container.rebind(Types.EmailService).toConstantValue(mockEmailService);
  mockEmailService.execute.mockResolvedValue({});

  beforeEach(async () => {
    await umzug.up();
  });

  afterEach(async () => {
    await umzug.down({ to: 0 });
  });

  const mockCheckAdminToken = { execute: jest.fn() };
  const mockCheckAdminTokenRes = {
    owner: {
      accessLevel: 3,
      id: 1,
    },
  };

  it('works', async () => {
    container
      .rebind(Types.AdminCheckToken)
      .toConstantValue(mockCheckAdminToken);
    mockCheckAdminToken.execute.mockResolvedValue(mockCheckAdminTokenRes);

    const event = {
      headers: {
        Authorization: 'access_token',
      },
      pathParameters: {
        action: 'approve',
      },
      body: JSON.stringify({
        requestId: 1,
        comment: 'approve',
      }),
    };
    const res = await adminApproveRejectManageAdminRequest(event);
    const body = JSON.parse(res.body);
    const { status } = body;

    expect(status).toEqual('success');
  });
});
