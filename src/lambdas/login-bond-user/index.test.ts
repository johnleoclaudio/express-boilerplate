import 'reflect-metadata';
import _ from 'lodash';
import configFile from 'config';
import * as lambdaModule from './index';
import Database from '../../db/index';
import container from '../../index';
import Types from '../../types';

import Umzug = require('umzug');

const handler = lambdaModule as any;
const { loginBondUser } = handler;

const PUBLIC_KEY: string = configFile.get('application.publicKey');
const PASSPHRASE: string = configFile.get('application.passphrase');

const config = {
  migrations: {
    params: [Database.getQueryInterface(), Database],
    path: 'seeders',
  },
};

const umzug = new Umzug(config);

describe('LoginUser', () => {
  beforeEach(async () => {
    await umzug.up();
    jest.resetAllMocks();
  });

  afterEach(async () => {
    await umzug.down({ to: 0 });
    jest.resetAllMocks();
  });

  it.only('works', async () => {
    const params = {
      username: 'joet@ro.com',
      password: 'password',
      deviceId: 'device_id_2',
    };

    const event = {
      body: JSON.stringify(params),
    };
    const res = await loginBondUser(event);
    const {
      data: { refreshToken, accessToken, expiresAt, payload },
    } = JSON.parse(res.body);

    expect(refreshToken).toBeTruthy();
    expect(accessToken).toBeTruthy();
    expect(expiresAt).toBeTruthy();
    expect(payload).toBeTruthy();
  });

  it('works but contact number', async () => {
    const params = {
      username: '639274728171',
      password: 'password',
    };

    const event = {
      body: JSON.stringify(params),
    };
    const res = await loginBondUser(event);
    const {
      data: { refreshToken, accessToken, expiresAt, payload },
    } = JSON.parse(res.body);

    expect(refreshToken).toBeTruthy();
    expect(accessToken).toBeTruthy();
    expect(expiresAt).toBeTruthy();
    expect(payload).toBeTruthy();
  });

  it('Wrong password', async () => {
    const localParams = {
      username: 'joet@ro.com',
      password: '1234',
    };

    const localEvent = {
      body: JSON.stringify(localParams),
    };
    const res = await loginBondUser(localEvent);

    const body = JSON.parse(res.body);

    expect(body.data.code).toEqual('InvalidLoginError');
    expect(body.data.message).toEqual('Invalid Login Credentials');
  });

  it('Account Blocked', async () => {
    const params = {
      username: 'NOT.sCAmmy@gmail.com',
      password: 'password',
    };

    const event = {
      body: JSON.stringify(params),
    };
    const res = await loginBondUser(event);
    const {
      data: { code },
    } = JSON.parse(res.body);
    expect(code).toBe('AccountBlocked');
  });

  it('throws an error when reached the max login attempt', async () => {
    const localParams = {
      username: 'joet@ro.com',
      password: '1234',
    };

    const localEvent = {
      body: JSON.stringify(localParams),
    };

    const res = await Promise.all([
      await loginBondUser(localEvent), // 1
      await loginBondUser(localEvent), // 2
      await loginBondUser(localEvent), // 3
      await loginBondUser(localEvent), // 4
      await loginBondUser(localEvent), // 5
      await loginBondUser(localEvent),
    ]);

    const response = res[res.length - 1];

    const body = JSON.parse(response.body);

    expect(body.data.code).toEqual('AccountBlocked');
    expect(body.data.message).toEqual('Account is blocked');
  }, 500000);

  it('resets the login try', async () => {
    const localParams = {
      username: 'joet@ro.com',
      password: '1234',
    };

    const localEvent = {
      body: JSON.stringify(localParams),
    };

    const correctParams = {
      username: 'joet@ro.com',
      password: 'password',
    };

    const correctEvent = {
      body: JSON.stringify(correctParams),
    };

    const res = await Promise.all([
      await loginBondUser(localEvent), // 1
      await loginBondUser(localEvent), // 2
      await loginBondUser(localEvent), // 3
      await loginBondUser(localEvent), // 4
      await loginBondUser(correctEvent),
    ]);

    const response = res[res.length - 1];

    const body = JSON.parse(response.body);

    expect(body.status).toEqual('success');
  }, 500000);
});
