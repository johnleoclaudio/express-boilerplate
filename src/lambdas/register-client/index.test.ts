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
const { registerClient } = handler;

const PUBLIC_KEY: string = configFile.get('application.publicKey');
const PASSPHRASE: string = configFile.get('application.passphrase');

const config = {
  migrations: {
    params: [Database.getQueryInterface(), Database],
    path: 'seeders',
  },
};

const umzug = new Umzug(config);

describe('RegisterClient', () => {
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
    details: {
      firstName: 'dick',
      lastName: 'gordon',
      someNumber: 1,
    },
  };

  const event = {
    body: JSON.stringify(params),
  };

  it('works', async () => {
    const res = await registerClient(event);
    const { data } = JSON.parse(res.body);

    expect(data.username).toEqual(params.username);
    expect(data.details).toEqual(params.details);
    expect(data.username).toEqual(params.username);
  });

  it('will fail since emails have to be unique', async () => {
    const localParams = {
      username: 'joet@ro.com',
      password: 'pass1234',
      details: {
        firstName: 'dick',
        lastName: 'gordon',
        someNumber: 1,
      },
    };
    const localEvent = {
      body: JSON.stringify(localParams),
    };
    const res = await registerClient(localEvent);
    const { data } = JSON.parse(res.body);
    expect(data.code).toEqual('DuplicateUserError');
  });
});
