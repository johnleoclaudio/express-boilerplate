import Password from '../../interfaces/models/password';

export default interface Orm {
  create: (params: Partial<Password>) => Promise<Password>;
  findAll: (opts: any) => Promise<Password[]>;
  findOne: (opts: any) => Promise<Password>;
  update: (values: Partial<Password>, opts: any) => Promise<Password>;
}
