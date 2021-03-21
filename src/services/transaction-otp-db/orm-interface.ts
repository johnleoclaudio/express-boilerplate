import TransactionOtp from '../../interfaces/models/transaction-otp';

export default interface Orm {
  create: (params: Partial<TransactionOtp>) => Promise<TransactionOtp>;
  update: (
    values: Partial<TransactionOtp>,
    opts: any,
  ) => Promise<TransactionOtp>;
  findOne: (opts: any) => Promise<TransactionOtp>;
}
