import { inject, injectable } from 'inversify';
import Types from '../../types';
import Executable from '../../interfaces/executable';
import IParams from './params';

@injectable()
export default class LoggerService implements Executable<IParams, any> {
  constructor(@inject(Types.Logger) private logger: any) {}

  execute(params: IParams) {
    const { message, ...rest } = params;
    const layer = rest.layer.toUpperCase();
    const name = rest.name.toUpperCase();
    const type = rest.type.toUpperCase();
    console.log(layer, name, type, JSON.stringify(message, null, 2));
  }
}
