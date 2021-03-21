import 'reflect-metadata';
import _ from 'lodash';
import * as lambdaModule from './index';
import Database from '../../db/index';

import Umzug = require('umzug');

const { verify } = lambdaModule as any;

const config = {
  migrations: {
    params: [Database.getQueryInterface(), Database],
    path: 'seeders',
  },
};

const umzug = new Umzug(config);

describe('verify', () => {
  beforeEach(async () => {
    await umzug.up();
  });

  afterEach(async () => {
    await umzug.down({ to: 0 });
  });

  const params = {};

  const event = {
    body: JSON.stringify(params),
    queryStringParameters: {
      code: 'ver_code',
      user: 'secure-123456',
      type: 'bond_user',
    },
  };

  it('works', async () => {
    const res = await verify(event);
    const { data, status } = JSON.parse(res.body);

    expect(status).toEqual('success');
    expect(data.verifiedAt).toBeTruthy();
  });
});
