import Model from '../../interfaces/models/admin-manage-request';

interface IFindAndCountAllResponse {
  row: Model[];
  count: number;
}
export default interface Orm {
  create: (params: Partial<Model>) => Promise<Model>;
  findAll: (opts: any) => Promise<Model[]>;
  findOne: (opts: any) => Promise<Model>;
  update: (values: Partial<Model>, opts: any) => Promise<Model>;
  findAndCountAll(opts?: any): Promise<IFindAndCountAllResponse>;
}
