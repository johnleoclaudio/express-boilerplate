import UserKeyPair from '../../interfaces/models/user-key-pair';

export default interface Orm {
  create: (params: Partial<UserKeyPair>) => Promise<UserKeyPair>;
  findAll: (opts: any) => Promise<UserKeyPair[]>;
  findOne: (opts: any) => Promise<UserKeyPair>;
  update: (values: Partial<UserKeyPair>, opts: any) => Promise<UserKeyPair>;
}
