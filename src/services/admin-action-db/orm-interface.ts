import AdminAction from '../../interfaces/models/admin-action';

export default interface Orm {
  create: (params: Partial<AdminAction>) => Promise<AdminAction>;
  findAll: (opts: any) => Promise<AdminAction[]>;
  findOne: (opts: any) => Promise<AdminAction>;
  update: (values: Partial<AdminAction>, opts: any) => Promise<AdminAction>;
  bulkCreate(
    params: any,
    identifiers: Array<string>,
    opts?: any,
  ): Promise<AdminAction[]>;
}
