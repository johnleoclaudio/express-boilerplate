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
const { validateToken } = handler;

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
    accessToken: 'access_token',
    scope: 'payments',
  };

  const event = {
    body: JSON.stringify(params),
  };

  it('works', async () => {
    const res = await validateToken(event);
    const { data } = JSON.parse(res.body);

    expect(data.result).toEqual(true);
  });

  it('should return false', async () => {
    const localParams = {
      accessToken: 'doesnotexist',
      scope: 'payments',
    };
    const localEvent = {
      body: JSON.stringify(localParams),
    };
    const res = await validateToken(localEvent);
    const { data } = JSON.parse(res.body);

    expect(data.code).toEqual('InvalidAccessToken');
    expect(data.message).toEqual('Access token is invalid');
  });
});
