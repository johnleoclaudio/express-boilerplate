import AdditionalInfo from '../../interfaces/models/additional-info';

export default interface Orm {
  create: (params: Partial<AdditionalInfo>) => Promise<AdditionalInfo>;
  findAll: (opts: any) => Promise<AdditionalInfo[]>;
  findOne: (opts: any) => Promise<AdditionalInfo>;
  update: (
    values: Partial<AdditionalInfo>,
    opts: any,
  ) => Promise<AdditionalInfo>;
  count(opts?: any): Promise<number>;
}
