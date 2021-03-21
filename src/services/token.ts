import jwt from 'jsonwebtoken';
import config from 'config';
import { injectable } from 'inversify';
import Encrypter from '../interfaces/encrypter';

const KEY: string = config.get('application.jwtSecret');

@injectable()
export default class TokenService implements Encrypter {
  encrypt(payload: any, opts?: any) {
    return jwt.sign(payload, KEY, opts);
  }

  decrypt(hash: string) {
    return jwt.verify(hash, KEY);
  }
}
