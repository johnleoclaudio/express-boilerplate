import config from 'config';

const containerPath: string = config.get('application.layerPathFromLambda');
const container = require(containerPath).default;
const Types = require(`${containerPath}/types`).default;

exports.adminGetAdmins = async (event: any) => {
  let response;
  // LOGGER
  const logger = container.get(Types.LoggerService);
  const loggerParams = {
    layer: 'lambda',
    name: 'adminGetAdmins',
    type: 'request',
    message: event,
  };
  logger.execute(loggerParams);
  // LOGGER
  try {
    const { Authorization: access_token } = event.headers;

    const tokenChecker = container.get(Types.AdminCheckToken);
    const adminDb = container.get(Types.AdminDataSource);

    // check if super admin
    const admin = await tokenChecker.execute({
      accessToken: access_token,
      type: 'bond', // TBD for Super Admins
      group: 'admin', // TBD for Super Admins
    });

    if (admin.owner.accessLevel < 3 && admin.owner.role == 'system_admin') {
      throw {
        code: 'RoleMismatch',
        message: 'Role Mismatch',
      };
    }

    const query = {
      where: {},
      attributes: [
        'id',
        'username',
        'type',
        'role',
        'accessLevel',
        'blockLogin',
        'twoFaVerified',
        'loginRetry',
        'createdAt',
        'updatedAt',
        'lastLoginAt',
      ],
    };

    const paginate = (query, { page, pageSize }) => {
      const offset = (page - 1) * pageSize;
      const limit = pageSize;

      return {
        ...query,
        offset,
        limit,
      };
    };

    const defaultValues = {
      page: 1,
      pageSize: 100,
      id: null,
    };

    const { page = 1, pageSize = 100, id = null } = {
      ...defaultValues,
      ...event.queryStringParameters,
    };

    // add more query
    const finalQuery = id ? { ...query, where: { ...query.where, id } } : query;

    const data = await adminDb.findAndCountAll(
      paginate(finalQuery, { page, pageSize }),
    );
    response = {
      body: {
        data: data?.rows,
        status: 'success',
        meta: { page, totalItems: data.count, pageSize },
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
        'Origin, X-Requested-With, Content-Type, Accept,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,access_token,X-Access-Token',
    },
    statusCode: response.statusCode,
    body: JSON.stringify(response.body),
  };
};
