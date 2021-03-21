import 'reflect-metadata';
import _ from 'lodash';
import container from '../../index';
import Types from '../../types';
import * as lambdaModule from './index';
import Database from '../../db/index';

import Umzug = require('umzug');

const handler = lambdaModule as any;
const { batchGenerateUsersInfoReport } = handler;

const config = {
  migrations: {
    params: [Database.getQueryInterface(), Database],
    path: 'seeders',
  },
};

const umzug = new Umzug(config);

describe('BatchGenerateUsersInfoReport', () => {
  beforeEach(async () => {
    await umzug.up();
  });

  afterEach(async () => {
    await umzug.down({ to: 0 });
  });

  const mockUploadGeneratedCSVReportService = {
    execute: jest.fn(),
  };

  const mockUploadGeneratedCSVReportServiceRes = 'success';

  it('works', async () => {
    // container
    //   .rebind(Types.UploadGeneratedCSVReportService)
    //   .toConstantValue(mockUploadGeneratedCSVReportService);
    // mockUploadGeneratedCSVReportService.execute.mockResolvedValue(
    //   mockUploadGeneratedCSVReportServiceRes,
    // );

    const res = await batchGenerateUsersInfoReport({});
    const { data, status } = JSON.parse(res.body);

    expect(data).toBeTruthy();
    expect(status).toEqual('success');
  });
});
