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
export default class UploadToS3Service extends AbstractExecutable<
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
      overwrite,
      secureId,
      data,
    } = params;
    const loggerParams: ILoggerServiceParams = {
      layer: 'service',
      name: 'uploadToS3',
      type: 'request',
      message: { userType, dataType, category, fileName, overwrite, secureId },
    };
    this.logger.execute(loggerParams);
    let key = `${DIRECTORY}/${userType}/${dataType}/${secureId}/${category}/${fileName}`;
    try {
      const getRes = await s3
        .getObject({
          Key: key,
          Bucket: BUCKET_NAME,
        })
        .promise();

      console.log('GET object res:', getRes);

      // TODO: If exists and overwrite, call put object. Else Throw

      const putRes = await s3
        .putObject({
          Body: data,
          Bucket: BUCKET_NAME,
          Key: key,
          ContentEncoding: 'base64',
          ContentType: `image/jpeg`,
        })
        .promise();

      console.log('PUT object res:', putRes);

      // TODO: Return object URL instead of key
      return {
        key,
        // key: `${BUCKET_NAME}/${key}`
      };
    } catch (err) {
      console.log('da err:', err);
      // const errString: string =
      //   http.STATUS_CODES[err.response.status] || 'Something Went Wrong';
      // // const code = errString.split(' ').join('');
      // // throw {
      // //   code: `${code}Error`,
      // //   message: errString,
      // // };
      // const code = err.response.data.code;
      // throw {
      //   code: `${code}`,
      //   message: errString,
      // };
      throw {
        code: 'S3UploadError',
        message: 'Message to S3 was unsuccessful',
      };
    }
  }
}
