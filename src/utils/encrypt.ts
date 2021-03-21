import config from 'config';
import crypto from 'crypto';

const PRIVATE_KEY: string = config.get('application.privateKey');
const PASSPHRASE: string = config.get('application.passphrase');

const encryptResponse = (buffer: any) => {
  const res = crypto.privateEncrypt(
    { key: PRIVATE_KEY, passphrase: PASSPHRASE },
    buffer,
  );

  return res;
};

export default encryptResponse;
