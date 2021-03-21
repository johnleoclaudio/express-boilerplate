import 'reflect-metadata';
import _ from 'lodash';
import * as lambdaModule from './index';
import Database from '../../db/index';

import Umzug = require('umzug');

const handler = lambdaModule as any;
const { adminGetAdmins } = handler;

const config = {
  migrations: {
    params: [Database.getQueryInterface(), Database],
    path: 'seeders',
  },
};

const umzug = new Umzug(config);

describe('adminGetAdmins', () => {
  beforeEach(async () => {
    await umzug.up();
  });

  afterEach(async () => {
    await umzug.down({ to: 0 });
  });

  it('works', async () => {
    const event = {
      headers: {
        Authorization: 'ops_access_token',
      },
      pathParameters: {
        type: 'bond',
        group: 'admin',
      },
    };

    const res = await adminGetAdmins(event);
    const { data, status } = JSON.parse(res.body);

    expect(data).toEqual(1);
  });
});
