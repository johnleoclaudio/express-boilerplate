import { injectable, inject } from 'inversify';
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
export default class GetS3FilesListService extends AbstractExecutable<
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
      name: 'GetS3FilesListService',
      type: 'request',
      message: '',
    };
    this.logger.execute(loggerParams);

    const Prefix = `${params.folderName}${params?.fileName || ''}`;

    const bucketParams = {
      Bucket: BUCKET_NAME,
      Delimiter: '/',
      Prefix,
      MaxKeys: params.pageSize || 20,
    };
    try {
      const res = await s3
        .listObjectsV2({
          ...bucketParams,
          ContinuationToken: params.nextPageToken,
        })
        .promise();

      const files = res?.Contents?.map(item => {
        const fileKey = item.Key?.split('/');
        const fileName = fileKey && fileKey[fileKey?.length - 1];
        return {
          objectKey: fileName,
          fileName,
          fileSize: item.Size,
          fileType: 'text/csv', // TODO:
        };
      });

      const parentDirectory = res?.Prefix;
      const folders = res?.CommonPrefixes?.map(
        item => parentDirectory && item?.Prefix?.replace(parentDirectory, ''),
      );

      return {
        pageSize: res.KeyCount,
        nextPageToken: res?.NextContinuationToken || null,
        files,
        folders,
        parentDirectory,
      };
    } catch (error) {
      this.logger.execute({
        ...loggerParams,
        message: error,
      });
      throw error;
    }
  }
}
