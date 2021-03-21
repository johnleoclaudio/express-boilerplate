import 'reflect-metadata';
import container from '../../index';
import * as lambdaModule from './index';
import * as loginLambdaModule from '../login-bond-user';
import Database from '../../db/index';

import Umzug = require('umzug');
import Types from '../../types';

const { createNewPinBondUser } = lambdaModule as any;
const { loginBondUser } = loginLambdaModule as any;

const config = {
  migrations: {
    params: [Database.getQueryInterface(), Database],
    path: 'seeders',
  },
};

const umzug = new Umzug(config);
const mockEmailService = {
  execute: jest.fn(),
};

describe('CreateNewPinBondUser', () => {
  beforeEach(async () => {
    await umzug.up();
  });

  afterEach(async () => {
    await umzug.down({ to: 0 });
  });

  const params = {
    newPin: '923712',
  };

  const event = {
    body: JSON.stringify(params),
    headers: {
      Authorization: 'bond_user_access_token_change_pin',
    },
  };

  it.only('changes password successfully', async () => {
    container.rebind(Types.EmailService).toConstantValue(mockEmailService);
    mockEmailService.execute.mockResolvedValue({});

    const res = await createNewPinBondUser(event);
    const { status } = JSON.parse(res.body);
    expect(status).toEqual('success');
  });

  it('logins successfully with the new password', async () => {
    await createNewPinBondUser(event);
    const params = {
      username: 'p@g.com',
      password: '923712',
      scope: 'bond_user',
    };

    const event2 = {
      body: JSON.stringify(params),
    };

    const res2 = await loginBondUser(event2);
    const data2 = JSON.parse(res2.body);
    expect(data2.status).toEqual('success');
  });
});
