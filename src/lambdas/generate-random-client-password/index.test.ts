import 'reflect-metadata';
import container from '../../index';
import * as lambdaModule from './index';
import * as loginLambdaModule from '../login-client/index';
import Database from '../../db/index';

import Umzug = require('umzug');

const { generateRandomClientPassword } = lambdaModule as any;
const { loginClient } = loginLambdaModule as any;

const config = {
  migrations: {
    params: [Database.getQueryInterface(), Database],
    path: 'seeders',
  },
};

const umzug = new Umzug(config);

describe('RandomClientPasswordGenerator', () => {
  beforeEach(async () => {
    await umzug.up();
  });

  afterEach(async () => {
    await umzug.down({ to: 0 });
  });

  const params = {
    secureId: 'abcd-1234',
  };

  const event = {
    body: JSON.stringify(params),
  };

  it('successfully updates user password with a random one', async () => {
    const res = await generateRandomClientPassword(event);
    const { status } = JSON.parse(res.body);
    expect(status).toEqual('success');
  });

  it('logins successfully with the new password', async () => {
    const res = await generateRandomClientPassword(event);
    const { data } = JSON.parse(res.body);

    const params = {
      username: 'joet@ro.com',
      password: data,
      scope: 'payments',
    };

    const event2 = {
      body: JSON.stringify(params),
    };

    const res2 = await loginClient(event2);
    const data2 = JSON.parse(res2.body);

    expect(data2.data.accessToken).toBeTruthy();
    expect(data2.data.refreshToken).toBeTruthy();
  });
});
