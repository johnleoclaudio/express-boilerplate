import 'reflect-metadata';
import ClientDbService from '.';

describe('ClientDbService', () => {
  const orm = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
  };

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('#create', () => {
    const clientDbService = new ClientDbService(orm);

    const params = {};

    it('creates client', async () => {
      const client = {
        id: 1,
      };

      orm.create.mockResolvedValue(client);
      const res = await clientDbService.create(params);
      expect(res).toBe(client);
    });
  });
});
