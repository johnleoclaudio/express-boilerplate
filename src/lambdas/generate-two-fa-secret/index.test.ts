import 'reflect-metadata';
import _ from 'lodash';
import * as lambdaModule from './index';
import Database from '../../db/index';

import Umzug = require('umzug');

const handler = lambdaModule as any;
const { generateTwoFaSecret } = handler;

const config = {
  migrations: {
    params: [Database.getQueryInterface(), Database],
    path: 'seeders',
  },
};

const umzug = new Umzug(config);

describe('GenerateTwoFa', () => {
  beforeEach(async () => {
    await umzug.up();
  });

  afterEach(async () => {
    await umzug.down({ to: 0 });
  });

  const params = {};

  it('Successfully generate a two fa secret if account is not yet two fa verified', async () => {
    const event = {
      body: JSON.stringify({
        username: 'kyle-fin@pdax.ph',
        password: 'password',
      }),
    };
    const result = await generateTwoFaSecret(event);
    const { data, status } = JSON.parse(result.body);
    expect(status).toBe('success');
    expect(data).not.toBeNull();
    expect(data.url).not.toBeNull();
    expect(data.secret).not.toBeNull();
    expect(data.url.length).not.toBe(0);
    expect(data.secret.length).not.toBe(0);
  });

  it('Successfully generate a two fa secret if account is not yet two fa verified', async () => {
    const event = {
      body: JSON.stringify({
        username: 'rosh@pdax.ph',
        password: 'password',
      }),
    };
    const result = await generateTwoFaSecret(event);
    const { data, status } = JSON.parse(result.body);
    expect(status).toBe('failed');
    expect(data.code).toBe('TwoFaAlreadyVerified');
    // expect(data).not.toBeNull();
    // expect(data.url).not.toBeNull();
    // expect(data.secret).not.toBeNull();
    // expect(data.url.length).not.toBe(0);
    // expect(data.secret.length).not.toBe(0);
  });
});
