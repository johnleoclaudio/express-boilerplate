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
const { registerAdmin } = handler;

const config = {
  migrations: {
    params: [Database.getQueryInterface(), Database],
    path: 'seeders',
  },
};

const umzug = new Umzug(config);

describe('RegisterAdmin', () => {
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
    password: 'P@ass1234',
    role: 'ops_maker',
    type: 'bond',
  };

  const event = {
    body: JSON.stringify(params),
  };

  // tODO: Fix asserts
  it('works', async () => {
    const res = await registerAdmin(event);
    const { data } = JSON.parse(res.body);

    expect(data.id).toBeTruthy();
  });

  // TODO: Fix duplicate error response
  it.skip('will fail since emails have to be unique', async () => {
    const localParams = {
      username: 'rosh@pdax.ph',
      password: 'P@ass1234',
      role: 'ops_maker',
      type: 'bond',
    };

    const localEvent = {
      body: JSON.stringify(localParams),
    };
    const res = await registerAdmin(localEvent);
    const { data } = JSON.parse(res.body);
  });
});
