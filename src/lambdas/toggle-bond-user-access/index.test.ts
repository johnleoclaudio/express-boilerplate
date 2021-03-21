import 'reflect-metadata';

import container from '../../index';
import Types from '../../types';

import * as lambdaModule from './index';
import Database from '../../db/index';

import Umzug = require('umzug');

const handler = lambdaModule as any;
const { toggleBondUserAccess } = handler;

const config = {
  migrations: {
    params: [Database.getQueryInterface(), Database],
    path: 'seeders',
  },
};

const umzug = new Umzug(config);

describe('ToggleUserAccess', () => {
  const mockCheckAdminToken = {
    execute: jest.fn(),
  };

  const mockAuthRes = {
    owner: {
      id: 3,
      username: 'dev_cs_maker',
      type: 'bond',
      role: 'cs_maker',
      createdAt: '2020-06-07T02:59:21.247Z',
      updatedAt: '2020-06-07T02:59:21.247Z',
    },
  };

  beforeEach(async () => {
    await umzug.up();
    // jest.resetAllMocks();
  });

  afterEach(async () => {
    await umzug.down({ to: 0 });
    // jest.resetAllMocks();
  });

  it('Disable scammer login access', async () => {
    container
      .rebind(Types.AdminCheckToken)
      .toConstantValue(mockCheckAdminToken);
    mockCheckAdminToken.execute.mockResolvedValue(mockAuthRes);

    const params = {
      userId: 6,
      access: 'login',
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

    const res = await toggleBondUserAccess(event);
    const { data } = JSON.parse(res.body);

    expect(data.id).toBe(params.userId);
    expect(data.blockLogin).toBeTruthy();
  });

  it('User does not exist', async () => {
    const params = {
      userId: 69,
      access: 'login',
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

    const res = await toggleBondUserAccess(event);
    const { data, status } = JSON.parse(res.body);

    expect(res.statusCode).toBe(400);
    expect(data.code).toBe('NothingToUpdateError');
    expect(status).toBe('failed');
  });

  it('Disable trade access', async () => {
    container
      .rebind(Types.AdminCheckToken)
      .toConstantValue(mockCheckAdminToken);
    mockCheckAdminToken.execute.mockResolvedValue(mockAuthRes);
    const params = {
      userId: 6,
      access: 'trade',
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

    const res = await toggleBondUserAccess(event);
    const { data, status } = JSON.parse(res.body);

    expect(data.blockTrade).toBeTruthy();
  });
  it('Disable withdraw access', async () => {
    container
      .rebind(Types.AdminCheckToken)
      .toConstantValue(mockCheckAdminToken);
    mockCheckAdminToken.execute.mockResolvedValue(mockAuthRes);
    const params = {
      userId: 6,
      access: 'withdraw',
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

    const res = await toggleBondUserAccess(event);
    const { data, status } = JSON.parse(res.body);

    expect(data.blockWithdraw).toBeTruthy();
  });
  it('Invalid access to block', async () => {
    container
      .rebind(Types.AdminCheckToken)
      .toConstantValue(mockCheckAdminToken);
    mockCheckAdminToken.execute.mockResolvedValue(mockAuthRes);
    const params = {
      userId: 6,
      access: 'cash-in',
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

    const res = await toggleBondUserAccess(event);
    const { data, status } = JSON.parse(res.body);

    expect(res.statusCode).toBe(400);
    expect(data.code).toBe('ValidationError');
    expect(status).toBe('failed');
  });
});
