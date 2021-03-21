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

describe('CheckS3Bucket', () => {
  beforeEach(async () => {
    await umzug.up();
  });

  afterEach(async () => {
    await umzug.down({ to: 0 });
  });

  it('Checks if object exists', async () => {
    const checkS3Bucket: any = container.get(Types.CheckS3BucketService);
    const res = await checkS3Bucket.execute({
      userType: 'bond_user',
      dataType: 'kyc',
      category: 'id',
      fileName: 'file',
      secureId: 'secureId',
    });

    expect(res.contentType).toBeTruthy();
  }, 10000);

  it('Throws error since object does not exist', async () => {
    const checkS3Bucket: any = container.get(Types.CheckS3BucketService);
    try {
      await checkS3Bucket.execute({
        userType: 'bond_user',
        dataType: 'kyc',
        category: 'id',
        fileName: 'file',
        secureId: 'secureIdXD',
      });
    } catch (err) {
      expect(err.code).toEqual('NotFound');
      return;
    }
    throw 'fail';
  }, 10000);
});
