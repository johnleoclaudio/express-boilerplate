import config from 'config';

const containerPath: string = config.get('application.layerPathFromLambda');
const container = require(containerPath).default;
const Types = require(`${containerPath}/types`).default;

exports.generateGetPresignedUrl = async (event: any) => {
  let response;

  const err = {
    code: 'MissingParametersError',
    message: 'Missing parameters',
  };

  try {
    const { Authorization: access_token } = event.headers;
    const { type, group } = event.pathParameters;
    const tokenChecker = container.get(Types.AdminCheckToken);

    const admin = await tokenChecker.execute({
      accessToken: access_token,
      type,
      group,
    });

    if (admin.owner.accessLevel < 1) {
      throw {
        code: 'RoleMismatch',
        message: 'Role Mismatch',
      };
    }

    if (!event.queryStringParameters) {
      throw err;
    }

    const params = event?.queryStringParameters;

    const validType = params?.type;
    const folder = params?.folder;
    const fileName = params?.fileName;

    if (!validType || !fileName) {
      throw err;
    }

    const validTypes = ['bond-users', 'investors', 'miscellaneous'];

    if (!validTypes.includes(validType)) {
      throw {
        code: 'TypeNotSupportedError',
        message: 'Type not supported',
      };
    }

    const basePath = `pdaxauth/bond_user/reports`;

    const key = `${basePath}/${validType}${
      folder ? '/' + folder : ''
    }/${fileName}`;

    const generateUrl = container.get(Types.GenerateGetPresignedUrlService);

    const data = await generateUrl.execute({
      key,
    });

    response = {
      body: {
        data,
        status: 'success',
      },
      statusCode: 200,
    };
  } catch (err) {
    response = {
      body: {
        data: err,
        status: 'failed',
      },
      statusCode: 400,
    };
  }

  return {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,OPTIONS,PATCH',
      'Access-Control-Allow-Headers':
        'Origin, X-Requested-With, Content-Type, Accept,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,access_token',
    },
    statusCode: response.statusCode,
    body: JSON.stringify(response.body),
  };
};
