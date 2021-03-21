import { injectable } from 'inversify';

import AbstractExecutable from '../../abstract-executable';

import IParams from './params';
import IResponse from './response';
import schema from './schema';

@injectable()
export default class SampleFeature extends AbstractExecutable<
  IParams,
  IResponse
> {
  constructor() {
    super();
    this.schema = schema;
  }

  async run(params: IParams) {
    console.log('Sample Feature', params);

    return true;
  }
}
