import { injectable } from 'inversify';
import Executable from './interfaces/executable';
import JoiError from './utils/joi-error';

@injectable()
export default abstract class AbstractExecutable<IParams, IResponse>
  implements Executable<IParams, IResponse> {
  protected schema;

  abstract run(params: IParams, opts: any);

  execute(params: IParams, opts?: any) {
    const joiError = new JoiError(this.schema, params);
    const errDetails = joiError.getErrors();
    if (errDetails.length) {
      throw {
        code: 'ValidationError',
        details: errDetails,
      };
    }

    return this.run(params, opts);
  }
}
