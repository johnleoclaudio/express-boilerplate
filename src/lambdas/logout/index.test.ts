import 'reflect-metadata';
import _ from 'lodash';

import * as lambdaModule from './index';
import Database from '../../db/index';

import Umzug = require('umzug');

const handler = lambdaModule as any;
const { logout } = handler;

const config = {
  migrations: {
    params: [Database.getQueryInterface(), Database],
    path: 'seeders',
  },
};

const umzug = new Umzug(config);

describe('Logout', () => {
  beforeEach(async () => {
    await umzug.up();
    jest.resetAllMocks();
  });

  afterEach(async () => {
    await umzug.down({ to: 0 });
    jest.resetAllMocks();
  });

  it('works - bond user', async () => {
    const event = {
      headers: {
        Authorization: 'bond_user_access_token',
      },
      pathParameters: {
        type: 'bond',
        group: 'user',
      },
    };
    const res = await logout(event);
    const {
      data: { result },
      status,
    } = JSON.parse(res.body);

    expect(result).toEqual(true);
    expect(status).toEqual('success');
  });

  it('works - pixo user', async () => {
    const event = {
      headers: {
        Authorization: 'access_token',
      },
      pathParameters: {
        type: 'pixo',
        group: 'user',
      },
    };
    const res = await logout(event);
    const {
      data: { result },
      status,
    } = JSON.parse(res.body);

    expect(result).toEqual(true);
    expect(status).toEqual('success');
  });

  it('works - bond admin', async () => {
    const event = {
      headers: {
        Authorization: 'ops_access_token',
      },
      pathParameters: {
        type: 'bond',
        group: 'admin',
      },
    };
    const res = await logout(event);
    const {
      data: { result },
      status,
    } = JSON.parse(res.body);

    expect(result).toEqual(true);
    expect(status).toEqual('success');
  });

  it('fails', async () => {
    const err = {
      code: 'UnsupportedError',
      message: 'Unsupported error',
    };
    const event = {
      pathParameters: {
        type: 'notauser',
        group: 'notagroup',
      },
      headers: {
        Authorization: 'random_access_token',
      },
    };
    const res = await logout(event);
    const { status, data } = JSON.parse(res.body);

    expect(data).toEqual(err);
    expect(status).toEqual('failed');
  });

  it.only('works - client payments', async () => {
    const event = {
      headers: {
        Authorization: 'client_access_token',
      },
      pathParameters: {
        type: 'client',
        group: 'payments',
      },
    };
    const res = await logout(event);
    const {
      data: { result },
      status,
    } = JSON.parse(res.body);

    expect(result).toEqual(true);
    expect(status).toEqual('success');
  });
});
