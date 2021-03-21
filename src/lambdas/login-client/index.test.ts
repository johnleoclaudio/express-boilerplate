import 'reflect-metadata';
import _ from 'lodash';
import * as lambdaModule from './index';
import Database from '../../db/index';
import crypto from 'crypto';
import configFile from 'config';
import container from '../../index';
import Types from '../../types';

import Umzug = require('umzug');

const handler = lambdaModule as any;
const { loginClient } = handler;

const PUBLIC_KEY: string = configFile.get('application.publicKey');
const PASSPHRASE: string = configFile.get('application.passphrase');

const config = {
  migrations: {
    params: [Database.getQueryInterface(), Database],
    path: 'seeders',
  },
};

const umzug = new Umzug(config);

describe('ClientLogin', () => {
  beforeEach(async () => {
    await umzug.up();
    // jest.resetAllMocks();
  });

  afterEach(async () => {
    await umzug.down({ to: 0 });
    // jest.resetAllMocks();
  });

  const params = {
    username: 'joet@ro.com',
    password: 'password',
    scope: 'payments',
  };

  const event = {
    body: JSON.stringify(params),
  };

  it('works', async () => {
    const res = await loginClient(event);
    const { data } = JSON.parse(res.body);

    expect(data.accessToken).toBeTruthy();
    expect(data.refreshToken).toBeTruthy();
  });
});
