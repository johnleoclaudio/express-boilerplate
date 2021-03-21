import Client from '../../interfaces/models/client';

export default interface Orm {
  create: (params: Partial<Client>) => Promise<Client>;
  findAll: (opts: any) => Promise<Client[]>;
  findOne: (opts: any) => Promise<Client>;
  update: (values: Partial<Client>, opts: any) => Promise<Client>;
}
