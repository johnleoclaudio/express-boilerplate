import config from 'config';

const containerPath: string = config.get('application.layerPathFromLambda');
const container = require(containerPath).default;
const Types = require(`${containerPath}/types`).default;

exports.toggleBondUserAccess = async (event: any) => {
  let response;

  try {
    const { Authorization: access_token } = event.headers;
    const { type, group } = event.pathParameters;
    const { userId, access } = JSON.parse(event.body);

    const tokenChecker = container.get(Types.AdminCheckToken);

    const { owner: admin } = await tokenChecker.execute({
      accessToken: access_token,
      type,
      group,
    });

    // if (admin.accessLevel < 2) {
    //   if (admin.role !== 'cs_helper') {
    //     throw {
    //       code: 'RoleMismatch',
    //       message: 'Role Mismatch',
    //     };
    //   }
    // }

    const allowedRoles = ['cs_maker', 'cs_checker', 'cs_helper'];

    if (!allowedRoles.includes(admin.role)) {
      // TODO: Temporary removed checking for admin access level 3
      // if (admin.accessLevel < 2) {
      throw {
        code: 'RoleMismatch',
        message: 'Role Mismatch',
      };
      // }
    }

    const toggleAccess = container.get(Types.ToggleUserAccess);
    const data = await toggleAccess.execute({
      userId,
      access,
      adminId: admin.id,
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
        'Origin, X-Requested-With, Content-Type, Accept,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,access_token,X-Access-Token',
    },
    statusCode: response.statusCode,
    body: JSON.stringify(response.body),
  };
};
