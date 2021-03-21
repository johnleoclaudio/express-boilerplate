import 'reflect-metadata';
import _ from 'lodash';
import * as lambdaModule from './index';
import Database from '../../db/index';
import crypto from 'crypto';
import configFile from 'config';
import container from '../../index';
import Types from '../../types';

import Umzug = require('umzug');

const handler = lambdaModule as any;
const { approveKyc } = handler;

const PUBLIC_KEY: string = configFile.get('application.publicKey');
const PASSPHRASE: string = configFile.get('application.passphrase');

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
    // jest.resetAllMocks();
  });

  afterEach(async () => {
    await umzug.down({ to: 0 });
    // jest.resetAllMocks();
  });

  it.only('works. approves kyc', async () => {
    const params = {
      userId: '9cb763ed-1d9c-43c3-b194-49f0968b7b91',
      action: 'approve',
      // remarks: '',
      riskRating: 'high',
    };

    const event = {
      body: JSON.stringify(params),
      headers: {
        Authorization: 'cs_access_token',
      },
      pathParameters: {
        type: 'bond',
        group: 'admin',
      },
    };

    const res = await approveKyc(event);
    const { data } = JSON.parse(res.body);

    console.log('succ reply:', data);
    // expect(data.ownerType).toEqual(event.pathParameters.scope);
    // expect(data.type).toEqual(event.pathParameters.type);
    // expect(data.details).toBeTruthy();
  });

  it.skip('works. rejects kyc', async () => {
    const params = {
      userId: 1,
      action: 'reject',
      remarks: 'Image is blurry.',
      // riskRating: 'high'
    };

    const event = {
      body: JSON.stringify(params),
      headers: {
        Authorization: 'cs_access_token',
      },
      pathParameters: {
        type: 'bond',
        group: 'admin',
      },
    };

    const res = await approveKyc(event);
    const { data } = JSON.parse(res.body);

    expect(data.retryKyc).toBeTruthy();
    expect(data.remarks).toBeTruthy();
  });
});
