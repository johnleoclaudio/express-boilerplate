import 'reflect-metadata';
import _ from 'lodash';
import container from '../../index';
import Types from '../../types';
import * as lambdaModule from './index';
import Database from '../../db/index';

import Umzug = require('umzug');

const { systemSyncUserData } = lambdaModule as any;

const config = {
  migrations: {
    params: [Database.getQueryInterface(), Database],
    path: 'seeders',
  },
};

const umzug = new Umzug(config);

describe('SystemSyncUserData', () => {
  beforeEach(async () => {
    await umzug.up();
  });

  afterEach(async () => {
    await umzug.down({ to: 0 });
  });

  const params = {
    secureIds: ['uruz_2', '9cb763ed-1d9c-43c3-b194-49f0968b7b91'],
    // secureIds: ['uruz_2']
  };

  const event = {
    body: JSON.stringify(params),
    headers: {
      Authorization: '^ZwxN1O#hHx`NkVlG8fH6Z!ys.nRtfuiT]gok&*7GGm',
    },
  };

  it('works', async () => {
    const res = await systemSyncUserData(event);

    const body = JSON.parse(res.body);
    const { data } = body;

    expect(data.length).toEqual(2);
  });
});
