import User from '../../interfaces/models/user';

export default interface Orm {
  create: (params: Partial<User>) => Promise<User>;
  findAll: (opts: any) => Promise<User[]>;
  findOne: (opts: any) => Promise<User>;
  update: (values: Partial<User>, opts: any) => Promise<User>;
}
