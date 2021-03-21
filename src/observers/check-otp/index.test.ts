import 'reflect-metadata';
import container from '../../index';
import Types from '../../types';

import Database from '../../db';

import Umzug = require('umzug');

declare const sessionCount: number;

const config = {
  migrations: {
    params: [Database.getQueryInterface(), Database],
    path: 'seeders',
  },
};

const umzug = new Umzug(config);

describe('CheckOtpObserver', () => {
  beforeEach(async () => {
    await umzug.up();
  });

  afterEach(async () => {
    await umzug.down({ to: 0 });
  });

  it('creates a new session', async () => {
    const checkOtpObserver: any = container.get(Types.CheckOtpObserver);

    const res = await checkOtpObserver.execute({
      ownerId: 3,
      ownerType: 'bond_user',
      scope: 'bond_user',
    });

    expect(res.id).toEqual(sessionCount + 1);
  });
});
