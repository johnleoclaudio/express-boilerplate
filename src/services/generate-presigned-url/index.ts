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
export default class GeneratePresignedUrlService extends AbstractExecutable<
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
    const {
      userType,
      dataType,
      category,
      fileName,
      secureId,
      contentType,
    } = params;
    const loggerParams: ILoggerServiceParams = {
      layer: 'service',
      name: 'uploadToS3',
      type: 'request',
      message: {
        userType,
        dataType,
        category,
        fileName,
        secureId,
        contentType,
      },
    };
    this.logger.execute(loggerParams);
    let key = `${DIRECTORY}/${userType}/${dataType}/${secureId}/${category}/${fileName}`;

    const res = await s3.getSignedUrl('putObject', {
      Bucket: BUCKET_NAME,
      Key: key,
      Expires: 100,
      ContentType: contentType,
    });

    return res;
  }
}
