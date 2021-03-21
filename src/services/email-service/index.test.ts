import 'reflect-metadata';
import container from '../../index';
import Types from '../../types';

describe('EmailService', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('sends email', async () => {
    const mockEmailService = {
      execute: jest.fn(),
    };

    const mockEmailServiceRes = { message: 'success', status: 'success' };

    const params = {
      email: 'johnleoclaudio@gmail.com',
      subject: 'TEST EMAIL',
      content: 'test content',
      type: 'bonds',
    };
    container.rebind(Types.EmailService).toConstantValue(mockEmailService);
    mockEmailService.execute.mockResolvedValue(mockEmailServiceRes);
    const emailService: any = container.get(Types.EmailService);
    const res = await emailService.execute(params);

    expect(res).toEqual(mockEmailServiceRes);
  });
});
