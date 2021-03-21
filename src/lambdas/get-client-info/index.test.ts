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
const { getClientInfo } = handler;

const PUBLIC_KEY: string = configFile.get('application.publicKey');
const PASSPHRASE: string = configFile.get('application.passphrase');

const config = {
  migrations: {
    params: [Database.getQueryInterface(), Database],
    path: 'seeders',
  },
};

const umzug = new Umzug(config);

describe('GetClientInfo', () => {
  beforeEach(async () => {
    await umzug.up();
    // jest.resetAllMocks();
  });

  afterEach(async () => {
    await umzug.down({ to: 0 });
    // jest.resetAllMocks();
  });

  const params = {};

  const event = {
    body: JSON.stringify(params),
    headers: {
      Authorization: 'access_token',
    },
  };

  it('works', async () => {
    const res = await getClientInfo(event);
    const { data } = JSON.parse(res.body);

    expect(data.firstName).toEqual('Joe');
    expect(data.lastName).toEqual('Taro');
    expect(data.contactNumber).toEqual('639274728171');
    expect(data.username).toEqual('joet@ro.com');
  });
});
