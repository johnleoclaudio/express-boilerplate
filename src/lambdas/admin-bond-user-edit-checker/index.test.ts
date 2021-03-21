import 'reflect-metadata';
import _ from 'lodash';
import * as lambdaModule from './index';
import Database from '../../db/index';

import Umzug = require('umzug');

const handler = lambdaModule as any;
const { adminEditBondUserRequestChecker } = handler;

const config = {
  migrations: {
    params: [Database.getQueryInterface(), Database],
    path: 'seeders',
  },
};

const umzug = new Umzug(config);

declare const infoEditRequestCount: number;

describe('adminEditBondUserRequestChecker', () => {
  beforeEach(async () => {
    await umzug.up();
  });

  afterEach(async () => {
    await umzug.down({ to: 0 });
  });

  it('works - approve', async () => {
    const event = {
      headers: {
        Authorization: 'ops_access_token',
      },
      body: JSON.stringify({
        editRequestId: 6,
        comment: 'approval comment',
        action: 'approve',
      }),
      pathParameters: {
        type: 'bond',
        group: 'admin',
      },
    };

    const res = await adminEditBondUserRequestChecker(event);
    const { data, status } = JSON.parse(res.body);

    expect(data.approvedAt).toBeTruthy();
    expect(status).toEqual('success');
  });

  it('works - decline', async () => {
    const event = {
      headers: {
        Authorization: 'ops_access_token',
      },
      body: JSON.stringify({
        editRequestId: 1,
        comment: 'decline comment',
        action: 'decline',
      }),
      pathParameters: {
        type: 'bond',
        group: 'admin',
      },
    };

    const res = await adminEditBondUserRequestChecker(event);
    const { data, status } = JSON.parse(res.body);

    expect(data.declinedAt).toBeTruthy();
    expect(status).toEqual('success');
  });
});
