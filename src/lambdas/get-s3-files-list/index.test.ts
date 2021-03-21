import * as lambdaModule from './index';
import container from '../../index';
import Types from '../../types';

const { getS3FilesList } = lambdaModule as any;

describe('getS3FilesList', () => {
  it('works', async () => {
    const mockCheckAdminToken = {
      execute: jest.fn(),
    };

    const mockAdminCheckTokenRes = {
      owner: {
        accessLevel: 2,
      },
    };
    container
      .rebind(Types.AdminCheckToken)
      .toConstantValue(mockCheckAdminToken);
    mockCheckAdminToken.execute.mockResolvedValue(mockAdminCheckTokenRes);

    const event = {
      headers: {
        Authorization: 'auth',
      },
      queryStringParameters: {
        // pageSize: '4',
        nextPageToken: encodeURI(
          '1vTZBI568Sy5/T+mISjyuOiZd6z8rS4zxSEb9I/UyeUVlyiNOqGakgtkOGudiUSLw5onA9Lqw4LERivpg86cIhkC1avmSX4Fqk9TpkpTKFzjOzglgQAipQt/k69rcMcj1X7ipuwMslccnWFuE5R+Vumhh+cdWDLAEySJBUDnWnw9Z3UMeYtlSVjczFdgcoUZb',
        ),
        type: 'bond-users',
        folder: 'manual',
      },
      pathParameters: {
        type: 'bond',
        group: 'admin',
      },
    };
    const response = await getS3FilesList(event);

    expect(response).toEqual(1);
  });
});
