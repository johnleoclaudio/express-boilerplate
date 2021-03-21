import InfoEditRequest from '../../interfaces/models/info-edit-requests';

interface IFindAndCountAllResponse {
  row: InfoEditRequest[];
  count: number;
}
export default interface Orm {
  create: (
    params: Partial<InfoEditRequest>,
    opts: any,
  ) => Promise<InfoEditRequest>;
  findAll: (opts: any) => Promise<InfoEditRequest[]>;
  findOne: (opts: any) => Promise<InfoEditRequest>;
  update: (
    values: Partial<InfoEditRequest>,
    opts: any,
  ) => Promise<InfoEditRequest>;
  findAndCountAll(opts?: any): Promise<IFindAndCountAllResponse>;
  count(opts?: any): Promise<number>;
}
