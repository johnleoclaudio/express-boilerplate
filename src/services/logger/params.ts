export default interface ILoggerParams {
  layer: string;
  name: string;
  type: 'REQUEST' | 'request' | 'RESPONSE' | 'response';
  message: any;
}
