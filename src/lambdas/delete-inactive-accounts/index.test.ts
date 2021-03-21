import 'reflect-metadata';
import _ from 'lodash';
import container from '../../index';
import Types from '../../types';
import * as lambdaModule from './index';
import Database from '../../db/index';

import Umzug = require('umzug');

const { deleteInactiveAccounts } = lambdaModule as any;

const config = {
  migrations: {
    params: [Database.getQueryInterface(), Database],
    path: 'seeders',
  },
};

const umzug = new Umzug(config);

describe('DeleteInactiveAccounts', () => {
  beforeEach(async () => {
    await umzug.up();
  });

  afterEach(async () => {
    await umzug.down({ to: 0 });
  });

  const params = {
    deviceId: 'device_id',
    deviceName: 'Oneplus GM1900',
    identifier: '639274728171',
  };

  const event = {
    body: JSON.stringify(params),
    headers: {
      Authorization: '^ZwxN1O#hHx`NkVlG8fH6Z!ys.nRtfuiT]gok&*7GGm',
    },
  };

  const mockDelete = {
    execute: jest.fn(),
  };

  const mockDeleteRes = ['string'];

  // TODO: Check assert
  it('works', async () => {
    const res = await deleteInactiveAccounts(event);

    console.log('da res:', res);
    const body = JSON.parse(res.body);
    const { data } = body;

    expect(data.length).toEqual(4);
  });
});
