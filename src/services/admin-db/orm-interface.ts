import Admin from '../../interfaces/models/admin';

interface IFindAndCountAllResponse {
  row: Admin[];
  count: number;
}

export default interface Orm {
  create: (params: Partial<Admin>) => Promise<Admin>;
  findAll: (opts: any) => Promise<Admin[]>;
  findOne: (opts: any) => Promise<Admin>;
  update: (values: Partial<Admin>, opts: any) => Promise<Admin>;
  findAndCountAll(opts?: any): Promise<IFindAndCountAllResponse>;
}
