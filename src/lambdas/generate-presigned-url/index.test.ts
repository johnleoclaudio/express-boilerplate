import 'reflect-metadata';
import _ from 'lodash';
import * as lambdaModule from './index';
import Database from '../../db/index';
import Umzug = require('umzug');

const handler = lambdaModule as any;
const { generatePresignedUrl } = handler;

const config = {
  migrations: {
    params: [Database.getQueryInterface(), Database],
    path: 'seeders',
  },
};

const umzug = new Umzug(config);

describe('GetBondUserInfo', () => {
  beforeEach(async () => {
    await umzug.up();
    // jest.resetAllMocks();
  });

  afterEach(async () => {
    await umzug.down({ to: 0 });
    // jest.resetAllMocks();
  });

  const params = {
    userType: 'bond_user',
    dataType: 'kyc',
    category: 'id',
    fileName: 'file',
    contentType: 'image/jpeg',
  };

  const event = {
    body: JSON.stringify(params),
    headers: {
      Authorization: 'bond_user_access_token',
    },
  };

  it('works', async () => {
    const res = await generatePresignedUrl(event);
    const { data } = JSON.parse(res.body);

    expect(data.url).toBeTruthy();
  });
});
