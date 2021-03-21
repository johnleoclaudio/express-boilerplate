import 'reflect-metadata';
import _ from 'lodash';
import * as lambdaModule from './index';
import Database from '../../db/index';
import container from '../../index';
import Types from '../../types';

import Umzug = require('umzug');

const handler = lambdaModule as any;
const { adminCreateManageAdminRequest } = handler;

const config = {
  migrations: {
    params: [Database.getQueryInterface(), Database],
    path: 'seeders',
  },
};

const umzug = new Umzug(config);

declare const adminManageRequestCount: number;

describe('adminCreateManageAdminRequest', () => {
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
      body: JSON.stringify({
        action: 'create',
        payload: {
          email: 'john.claudio@pdax.ph',
          role: 'cs_maker',
          accessLevel: 1,
        },
      }),
    };
    const res = await adminCreateManageAdminRequest(event);
    const body = JSON.parse(res.body);
    const { status } = body;

    expect(status).toEqual('success');

    const manageAdminRequestDb: any = container.get(
      Types.AdminManageRequestDataSource,
    );

    const list = await manageAdminRequestDb.find({
      raw: true,
      attributes: ['id'],
    });

    expect(list.length).toEqual(adminManageRequestCount + 1);
  });
});
