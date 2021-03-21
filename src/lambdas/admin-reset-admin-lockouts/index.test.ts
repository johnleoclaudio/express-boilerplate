import 'reflect-metadata';
import _ from 'lodash';
import * as lambdaModule from './index';
import Database from '../../db/index';

import Umzug = require('umzug');

const handler = lambdaModule as any;
const { adminResetAdminLockouts } = handler;

const config = {
  migrations: {
    params: [Database.getQueryInterface(), Database],
    path: 'seeders',
  },
};

const umzug = new Umzug(config);

declare const infoEditRequestCount: number;

describe('adminResetAdminLockouts', () => {
  beforeEach(async () => {
    await umzug.up();
  });

  afterEach(async () => {
    await umzug.down({ to: 0 });
  });

  it('works', async () => {
    const event = {
      headers: {
        Authorization: 'admin_access_token',
      },
      body: JSON.stringify({
        adminId: 4,
      }),
      pathParameters: {
        type: 'bond',
        group: 'admin',
      },
    };

    const res = await adminResetAdminLockouts(event);
    const { data, status } = JSON.parse(res.body);

    expect(status).toEqual('success');
    expect(data).toEqual(1);
  });
});
