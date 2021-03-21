import BondUser from '../../interfaces/models/bond-user';

interface IFindAndCountAllResponse {
  row: BondUser[];
  count: number;
}
export default interface Orm {
  create: (params: Partial<BondUser>) => Promise<BondUser>;
  findAll: (opts: any) => Promise<BondUser[]>;
  findOne: (opts: any) => Promise<BondUser>;
  update: (values: Partial<BondUser>, opts: any) => Promise<BondUser>;
  findAndCountAll(opts?: any): Promise<IFindAndCountAllResponse>;
  count(opts?: any): Promise<number>;
  bulkCreate(
    params: any,
    identifiers: Array<string>,
    opts?: any,
  ): Promise<BondUser[]>;
}
