import { injectable, inject } from 'inversify';
import json2csv from 'papaparse';
import flat from 'flat';

import aws from 'aws-sdk';
import AbstractExecutable from '../../abstract-executable';
import IParams from './params';
import IResponse from './response';
import schema from './schema';

import Types from '../../types';
import Executable from '../../interfaces/executable';
import ILoggerServiceParams from '../logger/params';

const BUCKET_NAME: string =
  process.env.S3_BUCKET || 'anxone-dev-ap-southeast-1';
const s3 = new aws.S3();

@injectable()
export default class UploadGeneratedCSVReport extends AbstractExecutable<
  any,
  any
> {
  constructor(
    @inject(Types.LoggerService)
    private logger: Executable<ILoggerServiceParams, any>,
  ) {
    super();
    this.schema = schema;
  }

  async run(params: IParams) {
    const loggerParams: ILoggerServiceParams = {
      layer: 'service',
      name: 'UploadGeneratedCSVReport',
      type: 'request',
      message: '',
    };
    this.logger.execute(loggerParams);
    const flattenObject = params.data.map(item => flat(item));
    const Body = json2csv.unparse(flattenObject);
    const bucketParams = {
      Bucket: BUCKET_NAME,
      Key: params.filePath,
      Body,
      ContentType: 'text/csv',
    };
    const res = await s3.putObject(bucketParams).promise();
    return res;
  }
}
