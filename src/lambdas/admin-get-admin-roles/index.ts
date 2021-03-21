import config from 'config';
import Sequelize from 'sequelize';

const containerPath: string = config.get('application.layerPathFromLambda');
const container = require(containerPath).default;
const Types = require(`${containerPath}/types`).default;

exports.adminGetAdminRoles = async (event: any) => {
  let response;
  // LOGGER
  const logger = container.get(Types.LoggerService);
  const loggerParams = {
    layer: 'lambda',
    name: 'adminGetAdminRoles',
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

    if (admin.owner.accessLevel < 3 && admin.owner.role === 'system_admin') {
      throw {
        code: 'RoleMismatch',
        message: 'Role Mismatch',
      };
    }

    const adminRes = await adminDb.find({
      attributes: [Sequelize.fn('DISTINCT', Sequelize.col('role')), 'role'],
    });

    const data = adminRes
      .filter(admin => admin.role !== 'system_admin') // find a better approach
      .map(admin => admin.role);

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
        'Origin, X-Requested-With, Content-Type, Accept,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,access_token,X-Access-Token',
    },
    statusCode: response.statusCode,
    body: JSON.stringify(response.body),
  };
};
