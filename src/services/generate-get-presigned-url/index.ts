import { injectable, inject } from 'inversify';
import config from 'config';
import axios from 'axios';
import http from 'http';

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
export default class GenerateGetPresignedUrlService extends AbstractExecutable<
  IParams,
  IResponse
> {
  constructor(
    @inject(Types.LoggerService)
    private logger: Executable<ILoggerServiceParams, any>,
  ) {
    super();
    this.schema = schema;
  }

  async run(params: IParams) {
    const { key: Key } = params;
    const loggerParams: ILoggerServiceParams = {
      layer: 'service',
      name: 'GenerateGetPresignedUrlService',
      type: 'request',
      message: Key,
    };
    this.logger.execute(loggerParams);

    const res = await s3.getSignedUrl('getObject', {
      Bucket: BUCKET_NAME,
      Key,
      Expires: 1000,
    });

    return res;
  }
}
