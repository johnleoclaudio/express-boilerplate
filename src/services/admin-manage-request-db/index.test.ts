import Database from '../../db';
import container from '../../index';
import Types from '../../types';
import DataSource from '../../interfaces/data-source';
import Model from '../../interfaces/models/admin-manage-request';

import Umzug = require('umzug');

const config = {
  migrations: {
    params: [Database.getQueryInterface(), Database],
    path: 'seeders',
  },
};

const umzug = new Umzug(config);

declare const adminManageRequestCount: number;

describe('BondUserDb', () => {
  beforeEach(async () => {
    await umzug.up();
  });

  afterEach(async () => {
    await umzug.down({ to: 0 });
  });

  const db: DataSource<Model> = container.get(
    Types.AdminManageRequestDataSource,
  );

  it('works - create', async () => {
    const data = await db.create({
      scope: 'bonds',
      type: 'create',
      details: JSON.stringify({ test: 'test' }),
      requestedAt: new Date(),
      requestedBy: 1,
      requestReason: 'admin create',
    });

    expect(data.id).toEqual(adminManageRequestCount + 1);
  });

  it('works - find', async () => {
    const data = await db.find({
      raw: true,
    });

    expect(data.length).toEqual(adminManageRequestCount);
  });
  it('works - findOne', async () => {
    const params = {
      where: {
        id: 1,
      },
    };

    const data = await db.findOne(params);

    expect(data).toBeTruthy();
  });

  it('works - update', async () => {
    const data = await db.update(
      {
        approvalComment: 'asdfads',
        approvedAt: new Date(),
        approvedBy: 1,
      },
      {
        where: { id: 1 },
      },
    );

    expect(data[0]).toBeTruthy();
  });
});
