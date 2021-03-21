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

describe('GeneratePresignedUrl', () => {
  beforeEach(async () => {
    await umzug.up();
  });

  afterEach(async () => {
    await umzug.down({ to: 0 });
  });

  it('Generates Presigned Url', async () => {
    const generatePresignedUrlService: any = container.get(
      Types.GeneratePresignedUrlService,
    );

    const res = await generatePresignedUrlService.execute({
      userType: 'bond_user',
      dataType: 'kyc',
      category: 'id',
      fileName: 'file',
      secureId: 'secureId',
    });

    expect(res).toBeTruthy();
  }, 10000);
});
