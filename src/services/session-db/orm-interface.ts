import Session from '../../interfaces/models/session';

export default interface Orm {
  create: (params: Partial<Session>) => Promise<Session>;
  update: (values: Partial<Session>, opts: any) => Promise<Session>;
  findOne: (opts: any) => Promise<Session>;
  findAll: (opts: any) => Promise<[Session]>;
}
