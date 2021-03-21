import 'reflect-metadata';
import configuration from 'config';
import { addHours } from 'date-fns';
import container from '../../index';
import Types from '../../types';

import Database from '../../db';
const fs = require('fs');
import Umzug = require('umzug');

const config = {
  migrations: {
    params: [Database.getQueryInterface(), Database],
    path: 'seeders',
  },
};

const umzug = new Umzug(config);

describe('UserLogin', () => {
  beforeEach(async () => {
    await umzug.up();
  });

  afterEach(async () => {
    await umzug.down({ to: 0 });
  });

  const mockService = {
    execute: jest.fn(),
  };

  container.rebind(Types.ExchangeLoginService).toConstantValue(mockService);

  it('Upload', async () => {
    const uploadToS3Service: any = container.get(Types.UploadToS3Service);
    var data64 = fs.readFileSync(
      `${__dirname}/../../../config/nicco_twitter.jpeg`,
      'base64',
    );

    const res = await uploadToS3Service.execute({
      data: data64,
      userType: 'bond_user',
      dataType: 'kyc',
      category: 'id',
      fileName: 'file',
      overwrite: false,
      secureId: 'secureId',
    });
  }, 10000);
});
