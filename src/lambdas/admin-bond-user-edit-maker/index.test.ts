import 'reflect-metadata';
import _ from 'lodash';
import * as lambdaModule from './index';
import Database from '../../db/index';

import Umzug = require('umzug');

const handler = lambdaModule as any;
const { adminEditBondUserRequestMaker } = handler;

const config = {
  migrations: {
    params: [Database.getQueryInterface(), Database],
    path: 'seeders',
  },
};

const umzug = new Umzug(config);

declare const infoEditRequestCount: number;

describe('adminEditBondUserRequestMaker', () => {
  beforeEach(async () => {
    await umzug.up();
  });

  afterEach(async () => {
    await umzug.down({ to: 0 });
  });

  it('works', async () => {
    const event = {
      headers: {
        Authorization: 'ops_access_token',
      },
      pathParameters: {
        type: 'bond',
        group: 'admin',
      },
      body: JSON.stringify({
        ownerId: 1,
        ownerType: 'bond_user',
        editedCategory: 'personal',
        editedField: 'firstName',
        editedFieldPreviousInfo: 'Joe',
        editedFieldNewInfo: 'Noel',
        editReason: 'string',
      }),
    };

    const res = await adminEditBondUserRequestMaker(event);
    const { data, status } = JSON.parse(res.body);

    expect(data.id).toEqual(infoEditRequestCount + 1);
    expect(status).toEqual('success');
  });
});
