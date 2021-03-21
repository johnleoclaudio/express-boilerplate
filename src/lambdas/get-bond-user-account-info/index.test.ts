import 'reflect-metadata';
import _ from 'lodash';
import * as lambdaModule from './index';
import Database from '../../db/index';

import Umzug = require('umzug');

const handler = lambdaModule as any;
const { getBondUserAccountInfo } = handler;

const config = {
  migrations: {
    params: [Database.getQueryInterface(), Database],
    path: 'seeders',
  },
};

const umzug = new Umzug(config);

describe('GetAdditionalInfo', () => {
  beforeEach(async () => {
    await umzug.up();
  });

  afterEach(async () => {
    await umzug.down({ to: 0 });
  });

  it('works. approves kyc', async () => {
    const event = {
      headers: {
        Authorization: 'cs_access_token',
      },
      pathParameters: {
        type: 'bond',
        group: 'admin',
      },
      queryStringParameters: {
        userId: 2,
      },
    };

    const res = await getBondUserAccountInfo(event);
    const { data, status } = JSON.parse(res.body);

    console.log('succ reply:', data, status);

    expect(data.internal).toBeTruthy();
    expect(data.personalInfo).toBeTruthy();
    expect(data.address).toBeTruthy();
    expect(data.employmentInfo).toBeTruthy();
    expect(data.proofs).toBeTruthy();
    expect(data.id).toBeTruthy();
  });
});
