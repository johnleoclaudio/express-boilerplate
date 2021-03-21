import VerificationCode from '../../interfaces/models/verification-code';

export default interface Orm {
  create: (params: Partial<VerificationCode>) => Promise<VerificationCode>;
  update: (
    values: Partial<VerificationCode>,
    opts: any,
  ) => Promise<VerificationCode>;
  findOne: (opts: any) => Promise<VerificationCode>;
}
