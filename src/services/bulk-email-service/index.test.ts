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

  it.only('bulk email', async () => {
    const params = {
      type: 'pdax',
      payload: [
        {
          recipients: ['john.claudio@pdax.ph'],
          content: {
            bond: 'TEST BONDS',
            isin: 'PIID0525H131',
            bondType: 'COUPON',
            creditedBonds: '78',
            interestRate: '3.0%',
            couponFrequency: 'QUARTERLY',
            taxation: '20% of Earnings',
            maturity: 'February 9, 2026',
            issuer: 'Republic of the Philippines',
          },
        },
      ],
      template: 'bonds_issue_bonds_test_2',
      defaultTemplateData:
        '{"bond": "TEST RTB", "isin": "PIIDXXXXXXX", "bondType": "COUPON", "creditedBonds": "0", "interestRate": "0%", "couponFrequency": "QUARTERLY", "taxation": "20% of Earnings", "maturity": "MM-DD-YYYY", "issuer": "Republic of the Philippines"}',
    };

    const emailService: any = container.get(Types.BulkEmailService);
    const res = await emailService.execute(params);

    expect(res).toEqual(1);
  });
});
