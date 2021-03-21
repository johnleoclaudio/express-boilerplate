import 'reflect-metadata';
import _ from 'lodash';
import configFile from 'config';
import crypto from 'crypto';
import * as lambdaModule from './index';
import Database from '../../db/index';
import container from '../../index';
import Types from '../../types';

import Umzug = require('umzug');

const handler = lambdaModule as any;
const { loginAdmin } = handler;

const PUBLIC_KEY: string = configFile.get('application.publicKey');
const PASSPHRASE: string = configFile.get('application.passphrase');

const config = {
  migrations: {
    params: [Database.getQueryInterface(), Database],
    path: 'seeders',
  },
};

const umzug = new Umzug(config);

describe('LoginAdmin', () => {
  beforeEach(async () => {
    await umzug.up();
    jest.resetAllMocks();
  });

  afterEach(async () => {
    await umzug.down({ to: 0 });
    jest.resetAllMocks();
  });

  it('works - ops', async () => {
    const params = {
      username: 'rosh@pdax.ph',
      password: 'password',
    };

    const event = {
      body: JSON.stringify(params),
      pathParameters: {
        scope: 'bond',
      },
    };
    const res = await loginAdmin(event);
    const {
      data: { refreshToken, accessToken, expiresAt, role },
    } = JSON.parse(res.body);

    expect(refreshToken).toBeTruthy();
    expect(accessToken).toBeTruthy();
    expect(expiresAt).toBeTruthy();
    expect(role).toEqual('ops_maker');
  });

  it('works - cs', async () => {
    const params = {
      username: 'jam@pdax.ph',
      password: 'password',
    };

    const event = {
      body: JSON.stringify(params),
      pathParameters: {
        scope: 'bond',
      },
    };
    const res = await loginAdmin(event);
    const {
      data: { refreshToken, accessToken, expiresAt, role },
    } = JSON.parse(res.body);

    expect(refreshToken).toBeTruthy();
    expect(accessToken).toBeTruthy();
    expect(expiresAt).toBeTruthy();
    expect(role).toEqual('cs_maker');
  });
});
