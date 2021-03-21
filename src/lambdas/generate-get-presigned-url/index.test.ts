import 'reflect-metadata';
import _ from 'lodash';
import * as lambdaModule from './index';
import container from '../../index';
import Types from '../../types';

const handler = lambdaModule as any;
const { generateGetPresignedUrl } = handler;

describe('GetBondUserInfo', () => {
  const event = {
    headers: {
      Authorization: 'bond_user_access_token',
    },
    pathParameters: {
      type: 'bonds',
      group: 'admin',
    },
    queryStringParameters: {
      type: 'bond-users',
      folder: 'automated/2021/January',
      fileName: 'automated-bond-users-2021-01-05 3:31:52 PM.csv',
    },
  };

  const mockCheckAdminToken = {
    execute: jest.fn(),
  };

  const mockCheckAdminTokenRes = {
    owner: {
      accessLevel: 2,
    },
  };

  it('works', async () => {
    container
      .rebind(Types.AdminCheckToken)
      .toConstantValue(mockCheckAdminToken);
    mockCheckAdminToken.execute.mockResolvedValue(mockCheckAdminTokenRes);

    const res = await generateGetPresignedUrl(event);
    const { data } = JSON.parse(res.body);

    expect(data).toEqual(1);
  });
});
