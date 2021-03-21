import 'reflect-metadata';
import _ from 'lodash';
import configFile from 'config';
import * as lambdaModule from './index';
import Database from '../../db/index';

import Umzug = require('umzug');

const handler = lambdaModule as any;
const { getAdditionalInfo } = handler;

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

  const params = {};

  it.only('works. gets kyc', async () => {
    const event = {
      body: JSON.stringify(params),
      headers: {
        Authorization: 'bond_user_access_token_no_csa',
      },
      pathParameters: {
        type: 'kyc',
        scope: 'bond_user',
      },
    };

    const res = await getAdditionalInfo(event);
    const { data } = JSON.parse(res.body);

    expect(data).toEqual(1);
    // expect(data.ownerType).toEqual(event.pathParameters.scope);
    // expect(data.type).toEqual(event.pathParameters.type);
    // expect(data.details).toEqual(1);
  });

  it('works. gets csa', async () => {
    const event = {
      body: JSON.stringify(params),
      headers: {
        Authorization: 'bond_user_access_token',
      },
      pathParameters: {
        type: 'csa',
        scope: 'bond_user',
      },
    };

    const res = await getAdditionalInfo(event);
    const { data } = JSON.parse(res.body);

    expect(data.ownerType).toEqual(event.pathParameters.scope);
    expect(data.type).toEqual(event.pathParameters.type);
    expect(data.details).toBeTruthy();
  });

  it('works. gets riskAcceptance', async () => {
    const event = {
      body: JSON.stringify(params),
      headers: {
        Authorization: 'bond_user_access_token',
      },
      pathParameters: {
        type: 'riskAcceptance',
        scope: 'bond_user',
      },
    };

    const res = await getAdditionalInfo(event);
    const { data } = JSON.parse(res.body);

    expect(data.ownerType).toEqual(event.pathParameters.scope);
    expect(data.type).toEqual(event.pathParameters.type);
    expect(data.details).toBeTruthy();
  });
});
