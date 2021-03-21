import 'reflect-metadata';
import container from '../../index';
import * as lambdaModule from './index';
import * as loginLambdaModule from '../login-admin/index';
import Database from '../../db/index';

import Umzug = require('umzug');

const { changePasswordAdmin } = lambdaModule as any;
const { loginAdmin } = loginLambdaModule as any;

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
    pathParameters: {
      type: 'bond',
      group: 'admin',
    },
    headers: {
      Authorization: 'ops_access_token',
    },
  };

  it('changes password successfully', async () => {
    const res = await changePasswordAdmin(event);
    const { status } = JSON.parse(res.body);
    expect(status).toEqual('success');
  });

  it('logins successfully with the new password', async () => {
    const res = await changePasswordAdmin(event);
    const { data } = JSON.parse(res.body);
    const params = {
      username: 'rosh@pdax.ph',
      password: 'helloworld',
      scope: 'bond',
      token: '123456',
      twoFaSecret: 'secret123',
    };

    const event2 = {
      body: JSON.stringify(params),
      pathParameters: {
        type: 'bond',
        group: 'admin',
      },
    };

    const res2 = await loginAdmin(event2);
    const data2 = JSON.parse(res2.body);
    expect(data2.status).toEqual('success');
  });
});
