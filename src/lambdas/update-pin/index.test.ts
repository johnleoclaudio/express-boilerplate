import 'reflect-metadata';
import _ from 'lodash';
import * as lambdaModule from './index';
import Database from '../../db/index';

import Umzug = require('umzug');

const { updatePin } = lambdaModule as any;

const config = {
  migrations: {
    params: [Database.getQueryInterface(), Database],
    path: 'seeders',
  },
};

const umzug = new Umzug(config);

describe('UpdateUserPin', () => {
  beforeEach(async () => {
    await umzug.up();
  });

  afterEach(async () => {
    await umzug.down({ to: 0 });
  });

  const params = {
    username: 'nicco.enriquez@pdax.ph',
    pin: '4321',
  };

  const event = {
    body: JSON.stringify(params),
  };

  it('works', async () => {
    const res = await updatePin(event);
    const { data } = JSON.parse(res.body);

    expect(data.pin).toEqual(params.pin);
  });
});
