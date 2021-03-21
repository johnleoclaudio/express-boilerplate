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

  const dbTransaction: any = container.get(Types.DbTransaction);

  const bondUsersDb: any = container.get(Types.BondUserDataSource);

  it('works - create', async () => {
    const dbTxn = await dbTransaction.transaction();

    const dataToUpdate = [
      {
        id: 16,
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        contactNumber: '',
        secureId: 'already_deleted',

        kycApprovedAt: new Date(),
        kycVerifiedAt: new Date(),
      },
    ];

    const data = await bondUsersDb.bulkUpdate(dataToUpdate, {}, [
      'kycApprovedAt',
      'kycVerifiedAt',
    ]);

    await dbTxn.commit();

    expect(JSON.stringify(data)).toEqual(1);
  });
});
