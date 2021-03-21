export default interface Encrypter {
  encrypt: (payload: any, opts?: any) => string;
  decrypt: (hash: string) => any;
}
