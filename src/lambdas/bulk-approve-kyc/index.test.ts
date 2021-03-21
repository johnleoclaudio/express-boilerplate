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
const { bulkApproveKyc } = handler;

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
      action: 'approve',
      approvalList: [
        {
          secureId: '9cb763ed-1d9c-43c3-b194-49f0968b7b91',
          riskRating: 'HIGH',
        },
        {
          secureId: 'uruz_2',
          riskRating: 'low',
        },
        {
          secureId: 'i_do_not_exist',
          riskRating: 'low',
        },
      ],
      role: 'cs_checker',
      remarks: 'Executed via bulk approve',
    };

    const event = {
      body: JSON.stringify(params),
      headers: {
        Authorization: 'cs_checker_access_token',
      },
      pathParameters: {
        type: 'bond',
        group: 'admin',
      },
    };

    const res = await bulkApproveKyc(event);
    const { data } = JSON.parse(res.body);

    console.log('succ reply:', data);
  });
});
