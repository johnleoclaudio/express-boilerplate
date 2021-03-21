import 'reflect-metadata';
import _ from 'lodash';
import * as lambdaModule from './index';
import Database from '../../db/index';
import container from '../../index';
import Types from '../../types';

import Umzug = require('umzug');

const handler = lambdaModule as any;
const { adminManageAdmins } = handler;

const config = {
  migrations: {
    params: [Database.getQueryInterface(), Database],
    path: 'seeders',
  },
};

const umzug = new Umzug(config);

describe('adminManageAdmins', () => {
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
        adminId: 2,
        action: 'toggle_access',
      },
    };
    const res = await adminManageAdmins(event);
    // const body = JSON.parse(res.body);
    // const { data, status } = body;

    // expect(status).toEqual('success');
    // expect(data).toEqual(1);
    expect(res).toEqual(1);
  });
});
