import Database from '../../db';
import container from '../../index';
import Types from '../../types';

import Umzug = require('umzug');

const config = {
  migrations: {
    params: [Database.getQueryInterface(), Database],
    path: 'seeders',
  },
};

const umzug = new Umzug(config);

describe('BondUserDb', () => {
  beforeEach(async () => {
    await umzug.up();
  });

  afterEach(async () => {
    await umzug.down({ to: 0 });
  });

  const passwordDb: any = container.get(Types.PasswordDataSource);

  it('works - create', async () => {
    const params = {
      ownerId: 1,
      ownerType: 'admin',
      password: 'asdfads',
    };

    const data = await passwordDb.create(params);

    expect(data.id).toEqual(2);
  });
  it.only('works - find', async () => {
    const data = await passwordDb.find({
      limit: 3,
      order: [['id', 'DESC']],
    });

    expect(data).toEqual(1);
  });
  it('works - findOne', async () => {
    const params = {
      where: {
        id: 1,
      },
    };

    const data = await passwordDb.findOne(params);

    expect(data).toBeTruthy();
  });
  it('works - update', async () => {
    const data = await passwordDb.update(
      {
        password: 'asdfads',
      },
      {
        where: { id: 1 },
      },
    );

    expect(data[0]).toBeTruthy();
  });
});
