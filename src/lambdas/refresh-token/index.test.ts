import 'reflect-metadata';
import _ from 'lodash';
import * as lambdaModule from './index';
import Database from '../../db/index';

import Umzug = require('umzug');

const { refreshToken } = lambdaModule as any;

const config = {
  migrations: {
    params: [Database.getQueryInterface(), Database],
    path: 'seeders',
  },
};

const umzug = new Umzug(config);

describe('RefreshToken', () => {
  beforeEach(async () => {
    await umzug.up();
  });

  afterEach(async () => {
    await umzug.down({ to: 0 });
  });

  const params = {
    refreshToken: 'refresh',
    type: 'pixo',
  };

  const event = {
    body: JSON.stringify(params),
  };

  it('works', async () => {
    const res = await refreshToken(event);

    const { data } = JSON.parse(res.body);

    expect(data.accessToken).toBeTruthy();
    expect(data.refreshToken).toBeTruthy();
  });

  it('token does not exist', async () => {
    const localParams = {
      refreshToken: 'asdfasf asfa sds',
      type: 'pixo',
    };
    const localEvent = {
      body: JSON.stringify(localParams),
    };
    const res = await refreshToken(localEvent);
    const { data } = JSON.parse(res.body);

    expect(data.code).toEqual('TokenValidationError');
  });

  it('refresh token has expired', async () => {
    const localParams = {
      refreshToken: 'expired_refresh_token',
      type: 'pixo',
    };
    const localEvent = {
      body: JSON.stringify(localParams),
    };
    const res = await refreshToken(localEvent);

    const { data } = JSON.parse(res.body);

    expect(data.code).toEqual('TokenValidationError');
  });

  it('refresh token has already been refreshed', async () => {
    const localParams = {
      refreshToken: 'refreshed_refresh_token',
      type: 'pixo',
    };
    const localEvent = {
      body: JSON.stringify(localParams),
    };
    const res = await refreshToken(localEvent);

    const { data } = JSON.parse(res.body);

    expect(data.code).toEqual('TokenValidationError');
  });

  it('refresh token for bond_user', async () => {
    const localParams = {
      refreshToken: 'bond_user_refresh_token_expired_session',
      type: 'bond_user',
    };
    const localEvent = {
      body: JSON.stringify(localParams),
    };
    const res = await refreshToken(localEvent);

    const { data } = JSON.parse(res.body);

    expect(data.accessToken).toBeTruthy();
    expect(data.refreshToken).toBeTruthy();
    expect(data.expiresAt).toBeTruthy();
  });

  it('refresh token for ops admin', async () => {
    const localParams = {
      refreshToken: 'admin_refresh_token_expired_session',
      type: 'admin',
    };
    const localEvent = {
      body: JSON.stringify(localParams),
    };
    const res = await refreshToken(localEvent);

    const { data } = JSON.parse(res.body);

    expect(data.accessToken).toBeTruthy();
    expect(data.refreshToken).toBeTruthy();
    expect(data.expiresAt).toBeTruthy();
    expect(data.role).toEqual('ops_maker');
  });

  it.only('refresh token for client', async () => {
    const localParams = {
      refreshToken: 'clients_payments_expired_session_refresh_token',
      type: 'payments',
    };
    const localEvent = {
      body: JSON.stringify(localParams),
    };
    const res = await refreshToken(localEvent);

    const { data } = JSON.parse(res.body);

    expect(data.accessToken).toBeTruthy();
    expect(data.refreshToken).toBeTruthy();
    expect(data.expiresAt).toBeTruthy();
  });
});
