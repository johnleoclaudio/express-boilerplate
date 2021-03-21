import 'reflect-metadata';
import _ from 'lodash';
import * as lambdaModule from './index';
import Database from '../../db/index';

import Umzug = require('umzug');

const handler = lambdaModule as any;
const { adminDeleteUsers } = handler;

const config = {
  migrations: {
    params: [Database.getQueryInterface(), Database],
    path: 'seeders',
  },
};

const umzug = new Umzug(config);

describe('adminDeleteUsers', () => {
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
      body: JSON.stringify({
        ownerIds: [
          '9cb763ed-1d9c-43c3-b194-49f0968b7b91',
          'secure-123456',
          'secure-789',
        ],
        ownerType: 'bond_user',
        scope: 'bond_user',
      }),
    };

    const result = ['secure-123456', 'secure-789'];

    const res = await adminDeleteUsers(event);
    const { data, status } = JSON.parse(res.body);

    expect(status).toEqual('success');
    expect(data).toEqual(result);
  });
});
