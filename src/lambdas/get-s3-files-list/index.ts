import config from 'config';

const containerPath: string = config.get('application.layerPathFromLambda');
const container = require(containerPath).default;
const Types = require(`${containerPath}/types`).default;

exports.getS3FilesList = async (event: any) => {
  let response;
  let statusCode = 200;
  const logger = container.get(Types.LoggerService);
  const loggerParams = {
    layer: 'lambda',
    name: 'getS3FilesList',
    type: 'request',
    message: event,
  };
  logger.execute(loggerParams);
  try {
    const { Authorization: accessToken } = event.headers;
    const { type, group } = event.pathParameters;
    const AdminCheckToken = container.get(Types.AdminCheckToken);

    const admin = await AdminCheckToken.execute({
      accessToken,
      type, // bond
      group, // admin
    });

    if (admin.owner.accessLevel < 1) {
      throw {
        code: 'RoleMismatch',
        message: 'Role Mismatch',
      };
    }

    const getS3FilesListService = container.get(Types.GetS3FilesListService);

    const params = event?.queryStringParameters;

    const validTypes = ['bond-users', 'investors'];

    const validType = params?.type;

    if (!validTypes.includes(validType)) {
      throw {
        code: 'TypeNotSupportedError',
        message: 'Type not supported',
      };
    }

    const subFolder = params?.folder ? `${params?.folder}/` : '';
    const folderName = `pdaxauth/bond_user/reports/${validType}/${subFolder ||
      ''}`;
    const fileName = params?.fileName;

    const paramsObj = {
      folderName,
      fileName,
      pageSize: Number(params?.pageSize) || 20,
      nextPageToken: params?.nextPageToken,
    };

    const data = await getS3FilesListService.execute(paramsObj);

    response = {
      body: {
        data: {
          files: data?.files,
          folders: data?.folders,
          parentDirectory: data?.parentDirectory,
        },
        meta: {
          pageSize: data?.pageSize,
          nextPageToken: data?.nextPageToken
            ? encodeURIComponent(data?.nextPageToken)
            : null,
        },
        status: 'success',
      },
      statusCode: 200,
    };
  } catch (err) {
    statusCode = 400;
    response = {
      body: {
        data: err,
        status: 'failed',
      },
      statusCode: 200,
    };
  }
  logger.execute({
    ...loggerParams,
    message: response,
    type: 'response',
  });
  return {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,OPTIONS,PATCH',
      'Access-Control-Allow-Headers':
        'Origin, X-Requested-With, Content-Type, Accept,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,access_token',
    },
    statusCode,
    body: JSON.stringify(response.body),
  };
};
