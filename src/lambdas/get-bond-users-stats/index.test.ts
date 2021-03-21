import 'reflect-metadata';
import _ from 'lodash';
import * as lambdaModule from './index';
import Database from '../../db/index';
import container from '../../index';
import Types from '../../types';

import Umzug = require('umzug');

const handler = lambdaModule as any;
const { getBondUsersStats } = handler;

const config = {
  migrations: {
    params: [Database.getQueryInterface(), Database],
    path: 'seeders',
  },
};

const umzug = new Umzug(config);

describe('getBondUsersStats', () => {
  beforeEach(async () => {
    await umzug.up();
  });

  afterEach(async () => {
    await umzug.down({ to: 0 });
  });

  const params = {};

  const event = {
    body: JSON.stringify(params),
    headers: {
      Authorization: 'bond_user_access_token',
    },
    pathParameters: {
      type: 'bond',
      group: 'admin',
    },
  };

  it('works', async () => {
    const mockCheckAdminToken = {
      execute: jest.fn(),
    };

    const mockAdminCheckTokenRes = 'success';
    container
      .rebind(Types.AdminCheckToken)
      .toConstantValue(mockCheckAdminToken);
    mockCheckAdminToken.execute.mockResolvedValue(mockAdminCheckTokenRes);

    const res = await getBondUsersStats(event);
    const { data } = JSON.parse(res.body);

    expect(data.numberOfVerifiedEmails).toEqual(4);
    expect(data.numberOfRegisteredUsers).toEqual(15);
    expect(data.numberOfMakerApprovedUsers).toEqual(4);
    expect(data.numberOfCheckerVerifiedUsers).toEqual(1);
    expect(data.numberOfPutToDraftUsers).toEqual(1);
    expect(data.numberOfFinishedKYC).toEqual(1);
    expect(data.numberOfSubmittedKYC).toEqual(1);
  });
});
