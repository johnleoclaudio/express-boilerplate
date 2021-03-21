import BondUser from '../../interfaces/models/bond-user';
import DataSource from '../../interfaces/data-source';

interface IFindAndCountAllResponse {
  row: BondUser[];
  count: number;
}

export default interface BondUserDataSource extends DataSource<BondUser> {
  // getTotal(accountName: string, opts?: any): Promise<number>;
  // getTotal(params: any): Promise<number>;
  // bulkCreate: (params: any, opts: any) => Promise<BondUser>;
  findAndCountAll(opts?: any): Promise<IFindAndCountAllResponse>;
}
