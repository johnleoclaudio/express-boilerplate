import 'reflect-metadata';
import container from '../../index';
import Types from '../../types';
import Database from '../../db';

import Umzug = require('umzug');

const config = {
  migrations: {
    params: [Database.getQueryInterface(), Database],
    path: 'seeders',
  },
};

const umzug = new Umzug(config);

describe('GenerateGetPresignedUrlService', () => {
  beforeEach(async () => {
    await umzug.up();
  });

  afterEach(async () => {
    await umzug.down({ to: 0 });
  });

  it('Generates Presigned Url', async () => {
    const GenerateGetPresignedUrlService: any = container.get(
      Types.GenerateGetPresignedUrlService,
    );

    const res = await GenerateGetPresignedUrlService.execute({
      key:
        'pdaxauth/bond_user/reports/bond-users-Mon Jul 06 2020 16:00:27 GMT+0000 (Coordinated Universal Time).csv',
    });

    // expect(res).toBeTruthy();
    expect(res).toEqual(1);
  }, 10000);
});
