import 'reflect-metadata';
import container from '../../index';
import Types from '../../types';
import * as lambdaModule from './index';
import Database from '../../db/index';

import Umzug = require('umzug');

const { createTwoFaBondUser } = lambdaModule as any;

const config = {
  migrations: {
    params: [Database.getQueryInterface(), Database],
    path: 'seeders',
  },
};

const umzug = new Umzug(config);

describe('createTwoFaBondUser', () => {
  beforeEach(async () => {
    await umzug.up();
  });

  afterEach(async () => {
    await umzug.down({ to: 0 });
  });

  const event = {
    headers: {
      Authorization: 'bond_user_access_token',
    },
  };

  it('successfully creates a 2FA secret', async () => {
    const res = await createTwoFaBondUser(event);
    const { status } = JSON.parse(res.body);
    expect(status).toEqual('success');
  });
});
