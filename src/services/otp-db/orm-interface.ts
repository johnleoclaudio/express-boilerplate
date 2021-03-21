import Otp from '../../interfaces/models/otp';

export default interface Orm {
  create: (params: Partial<Otp>) => Promise<Otp>;
  update: (values: Partial<Otp>, opts: any) => Promise<Otp>;
  findOne: (opts: any) => Promise<Otp>;
}
