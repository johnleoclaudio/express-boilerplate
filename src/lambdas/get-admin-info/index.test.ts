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
const { getAdminInfo } = handler;

const config = {
  migrations: {
    params: [Database.getQueryInterface(), Database],
    path: 'seeders',
  },
};

const umzug = new Umzug(config);

describe('GetAdminInfo', () => {
  beforeEach(async () => {
    await umzug.up();
    jest.resetAllMocks();
  });

  afterEach(async () => {
    await umzug.down({ to: 0 });
    jest.resetAllMocks();
  });

  it('works - ops', async () => {
    // const params = {
    //   accessToken: 'ops_access_token',
    // };
    const params = {};

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
    const res = await getAdminInfo(event);
    const body = JSON.parse(res.body);

    // console.log('body:', body);
  });

  it('works - cs', async () => {
    const params = {
      accessToken: 'cs_access_token',
    };

    const event = {
      body: JSON.stringify(params),
      pathParameters: {
        type: 'bond',
        group: 'admin',
        role: 'cs_maker',
      },
    };
    const res = await getAdminInfo(event);
    const body = JSON.parse(res.body);

    console.log('body:', body);
  });
});
