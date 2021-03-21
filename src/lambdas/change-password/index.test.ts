import 'reflect-metadata';
import container from '../../index';
import * as lambdaModule from './index';
import * as loginLambdaModule from '../login-client/index';
import Database from '../../db/index';

import Umzug = require('umzug');

const { changePassword } = lambdaModule as any;
const { loginClient } = loginLambdaModule as any;

const config = {
  migrations: {
    params: [Database.getQueryInterface(), Database],
    path: 'seeders',
  },
};

const umzug = new Umzug(config);

describe('ChangePassword', () => {
  beforeEach(async () => {
    await umzug.up();
  });

  afterEach(async () => {
    await umzug.down({ to: 0 });
  });

  const params = {
    oldPassword: 'password',
    newPassword: 'helloworld',
  };

  const event = {
    body: JSON.stringify(params),
    headers: {
      Authorization: 'access_token',
    },
  };

  it('changes password successfully', async () => {
    const res = await changePassword(event);
    const { status } = JSON.parse(res.body);
    expect(status).toEqual('success');
  });

  it('logins successfully with the new password', async () => {
    const res = await changePassword(event);
    const { data } = JSON.parse(res.body);
    const params = {
      username: 'joet@ro.com',
      password: 'helloworld',
      scope: 'payments',
    };

    const event2 = {
      body: JSON.stringify(params),
    };

    const res2 = await loginClient(event2);
    const data2 = JSON.parse(res2.body);
    expect(data2.status).toEqual('success');
  });
});
