import { injectable, inject } from 'inversify';
import config from 'config';
import axios from 'axios';
import http from 'http';

import AbstractExecutable from '../../abstract-executable';
import IParams from './params';
import IResponse from './response';
import schema from './schema';

import Types from '../../types';
import Executable from '../../interfaces/executable';
import ILoggerServiceParams from '../logger/params';
import aws from 'aws-sdk';

const BUCKET_NAME: string =
  process.env.S3_BUCKET || 'anxone-dev-ap-southeast-1';
const DIRECTORY: string = process.env.SERVICE_NAME || 'pdaxauth';
const s3 = new aws.S3();

@injectable()
export default class CheckS3BucketService extends AbstractExecutable<
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
    const { userType, dataType, category, fileName, secureId } = params;
    const loggerParams: ILoggerServiceParams = {
      layer: 'service',
      name: 'checkS3Bucket',
      type: 'request',
      message: { userType, dataType, category, fileName, secureId },
    };
    this.logger.execute(loggerParams);
    let key = `${DIRECTORY}/${userType}/${dataType}/${secureId}/${category}/${fileName}`;

    // console.log(BUCKET_NAME, key);

    // // TODO: Fix to await syntax?
    // s3.headObject({Bucket: BUCKET_NAME, Key: key}).on('success', function(response) {
    //   console.log('response:', response);
    //   return true;
    // }).on('error', function(err) {
    //   console.log('error:', err);
    //   return false;
    // }).send()

    try {
      const res = await s3
        .headObject({ Bucket: BUCKET_NAME, Key: key })
        .promise();

      return {
        acceptRanges: res.AcceptRanges,
        lastModified: res.LastModified,
        contentLength: res.ContentLength,
        eTag: res.ETag,
        contentEncoding: res.ContentEncoding,
        contentType: res.ContentType,
        metadata: res.Metadata,
      };
    } catch (err) {
      const code = err.code || 'UnknownError';
      const message = 'Error from Check S3 Bucket';

      throw {
        code,
        message,
      };
      // return err;
    }
  }
}
