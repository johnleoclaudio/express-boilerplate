import 'reflect-metadata';
import _ from 'lodash';
import * as lambdaModule from './index';
import Database from '../../db/index';

import Umzug = require('umzug');

const { updateClientInfo } = lambdaModule as any;

const config = {
  migrations: {
    params: [Database.getQueryInterface(), Database],
    path: 'seeders',
  },
};

const umzug = new Umzug(config);

describe('UpdateClientInfo', () => {
  beforeEach(async () => {
    await umzug.up();
  });

  afterEach(async () => {
    await umzug.down({ to: 0 });
  });

  const params = {
    firstName: 'dee',
    lastName: 'yoh',
    contactNumber: '09123456789',
    details: {},
  };

  const event = {
    body: JSON.stringify(params),
    headers: {
      Authorization: 'access_token',
    },
  };

  it('client info is successfully updated', async () => {
    const res = await updateClientInfo(event);
    const { data } = JSON.parse(res.body);
    expect(data.firstName).toEqual('dee');
    expect(data.lastName).toEqual('yoh');
    expect(data.contactNumber).toEqual('09123456789');
    expect(data.details).toEqual({});
  });
});
