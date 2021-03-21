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
const { registerBondUser } = handler;

const PUBLIC_KEY: string = configFile.get('application.publicKey');
const PASSPHRASE: string = configFile.get('application.passphrase');

const config = {
  migrations: {
    params: [Database.getQueryInterface(), Database],
    path: 'seeders',
  },
};

const umzug = new Umzug(config);

describe('RegisterBondUser', () => {
  beforeEach(async () => {
    await umzug.up();
    // jest.resetAllMocks();
  });

  afterEach(async () => {
    await umzug.down({ to: 0 });
    // jest.resetAllMocks();
  });

  const params = {
    username: 'nicco.enriquez@pdax.ph',
    password: 'pass1234',
    firstName: 'joe',
    lastName: 'taro',
    contactNumber: '639173121312',
  };

  const event = {
    body: JSON.stringify(params),
  };

  it('works', async () => {
    const res = await registerBondUser(event);
    const { data } = JSON.parse(res.body);

    expect(data.username).toEqual(params.username);
  });

  it.only('will fail since emails have to be unique', async () => {
    const localParams = {
      username: 'joet@ro.com',
      password: 'pass1234',
      firstName: 'joe',
      lastName: 'taro',
      contactNumber: '639173121312',
    };
    const localEvent = {
      body: JSON.stringify(localParams),
    };
    const res = await registerBondUser(localEvent);
    const { data } = JSON.parse(res.body);
    expect(data.code).toEqual('DuplicateUserError');
  });

  it('will fail since emails have to be unique', async () => {
    const localParams = {
      username: 'nicco.enriquez@pdax.ph',
      password: 'pass1234',
      firstName: 'joe',
      lastName: 'taro',
      contactNumber: '6391231234',
    };
    const localEvent = {
      body: JSON.stringify(localParams),
    };
    const res = await registerBondUser(localEvent);
    const { data } = JSON.parse(res.body);
    expect(data.code).toEqual('InvalidContactNumberFormatError');
  });
});
