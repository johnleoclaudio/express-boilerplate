import 'reflect-metadata';
import SessionDbService from '.';

describe('SessionDbService', () => {
  const orm = {
    create: jest.fn(),
    findAll: jest.fn(),
    aggregate: jest.fn(),
    update: jest.fn(),
    findOne: jest.fn(),
  };

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('#create', () => {
    const sessionDbService = new SessionDbService(orm);

    const params = {
      accessToken: 'access-token',
      refreshToken: 'refresh-token',
      expiresAt: new Date(),
    };

    it('returns the response of the entry orm', async () => {
      const session = {
        id: 1,
      };

      orm.create.mockResolvedValue(session);
      const res = await sessionDbService.create(params);
      expect(res).toBe(session);
    });

    it('fails when the db service throws an error', async () => {
      const expectedErr = { message: 'Something went wrong' };

      orm.create.mockRejectedValue(expectedErr);

      try {
        await sessionDbService.create(params);
      } catch (err) {
        expect(err.message).toEqual(expectedErr.message);
        expect(err.code).toBeTruthy();
      }
    });
  });
});
