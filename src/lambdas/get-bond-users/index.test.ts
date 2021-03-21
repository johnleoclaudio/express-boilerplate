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
const { getBondUsers } = handler;

const config = {
  migrations: {
    params: [Database.getQueryInterface(), Database],
    path: 'seeders',
  },
};

const umzug = new Umzug(config);

declare const bondUserCount: number;

describe('getBondUsers', () => {
  beforeEach(async () => {
    await umzug.up();
    jest.resetAllMocks();
  });

  afterEach(async () => {
    await umzug.down({ to: 0 });
    jest.resetAllMocks();
  });

  it('fetch all bond users', async () => {
    const event = {
      pathParameters: {
        type: 'bond',
        group: 'admin',
      },
      headers: {
        Authorization: 'cs_access_token',
      },
      queryStringParameters: { keyword: 'p@g.com' },
    };
    const res = await getBondUsers(event);
    const body = JSON.parse(res.body);
    const { data } = body;

    expect(data.length).toEqual(1);
  });

  it('fetch submitted accounts', async () => {
    const params = {};

    const event = {
      body: JSON.stringify(params),
      pathParameters: {
        type: 'bond',
        group: 'admin',
      },
      headers: {
        Authorization: 'cs_access_token',
      },
      queryStringParameters: {
        kyc: 'submitted',
      },
    };
    const res = await getBondUsers(event);
    const body = JSON.parse(res.body);
    const { data } = body;

    expect(data.length).toEqual(1);
  });

  it('fetch approved but not verified accounts', async () => {
    const params = {};

    const event = {
      body: JSON.stringify(params),
      pathParameters: {
        type: 'bond',
        group: 'admin',
      },
      headers: {
        Authorization: 'cs_access_token',
      },
      queryStringParameters: {
        kyc: 'approved',
      },
    };
    const res = await getBondUsers(event);
    const body = JSON.parse(res.body);
    const { data } = body;

    expect(data.length).toEqual(2);
  });

  it('fetch approved and verified accounts', async () => {
    const params = {};

    const event = {
      body: JSON.stringify(params),
      pathParameters: {
        type: 'bond',
        group: 'admin',
      },
      headers: {
        Authorization: 'cs_access_token',
      },
      queryStringParameters: {
        kyc: 'verified',
      },
    };
    const res = await getBondUsers(event);
    const body = JSON.parse(res.body);
    const { data } = body;

    expect(data.length).toEqual(1);
  });

  it('fetch rejected accounts', async () => {
    const params = {};

    const event = {
      body: JSON.stringify(params),
      pathParameters: {
        type: 'bond',
        group: 'admin',
      },
      headers: {
        Authorization: 'cs_access_token',
      },
      queryStringParameters: {
        kyc: 'rejected',
      },
    };
    const res = await getBondUsers(event);
    const body = JSON.parse(res.body);
    const { data } = body;

    expect(data.length).toEqual(1);
  });

  it('fetch blocked login accounts', async () => {
    const params = {};

    const event = {
      body: JSON.stringify(params),
      pathParameters: {
        type: 'bond',
        group: 'admin',
      },
      headers: {
        Authorization: 'cs_access_token',
      },
      queryStringParameters: {
        blockLogin: true,
      },
    };
    const res = await getBondUsers(event);
    const body = JSON.parse(res.body);
    const { data } = body;
    expect(data.length).toEqual(2);
  });

  it('fetch blocked login accounts', async () => {
    const params = {};

    const event = {
      body: JSON.stringify(params),
      pathParameters: {
        type: 'bond',
        group: 'admin',
      },
      headers: {
        Authorization: 'cs_access_token',
      },
      queryStringParameters: {
        blockOtp: true,
      },
    };
    const res = await getBondUsers(event);
    const body = JSON.parse(res.body);
    const { data } = body;
    expect(data.length).toEqual(2);
  });
});
