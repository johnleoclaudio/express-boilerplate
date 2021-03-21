import 'reflect-metadata';
import container from '../../index';
import Types from '../../types';
import LoggerService from '.';
import Executable from '../../interfaces/executable';

describe('LoggerService', () => {
  const loggerClient = {
    log: jest.fn(),
  };

  describe('#execute', () => {
    const loggerService: Executable<any, any> = new LoggerService(loggerClient);

    beforeEach(() => {
      container.rebind(Types.Logger).toConstantValue(loggerClient);
    });

    it('calls the logger client', async () => {
      await loggerService.execute({});
      expect(loggerClient.log).toHaveBeenCalled();
    });
  });
});
