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

describe('UploadGeneratedCSVReportService', () => {
  beforeEach(async () => {
    await umzug.up();
  });

  afterEach(async () => {
    await umzug.down({ to: 0 });
  });

  it('uploads a generated report', async () => {
    const UploadGeneratedCSVReportService: any = container.get(
      Types.UploadGeneratedCSVReportService,
    );

    const params = [
      {
        id: 1,
        name: 'John Doe',
        details: {
          birthday: '11-23-94',
          address: { street: '1', city: 'Manila' },
        },
      },
      {
        id: 2,
        name: 'John Wick',
        details: {
          birthday: '01-3-81',
          address: { street: '1', city: 'Manila' },
        },
      },
    ];
    const filePath = `pdaxauth/bond_user/reports/test-bond-users-${new Date()}.csv`; // TBD timestamp format

    const res = await UploadGeneratedCSVReportService.execute({
      data: params,
      filePath,
    });
    expect(res).toBeTruthy();
  }, 10000);
});
