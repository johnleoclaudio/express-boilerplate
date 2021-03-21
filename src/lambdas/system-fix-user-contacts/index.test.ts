import 'reflect-metadata';
import parsePhoneNumber from 'libphonenumber-js';
import * as lambdaModule from './index';
import Database from '../../db/index';

import Umzug = require('umzug');

const { systemFixUserContacts } = lambdaModule as any;

const config = {
  migrations: {
    params: [Database.getQueryInterface(), Database],
    path: 'seeders',
  },
};

const umzug = new Umzug(config);

describe('systemFixUserContacts', () => {
  beforeEach(async () => {
    await umzug.up();
  });

  afterEach(async () => {
    await umzug.down({ to: 0 });
  });

  it('works', async () => {
    const res = await systemFixUserContacts({});
    const { data } = JSON.parse(res.body);
    expect(data).toEqual(1);
  });
});
