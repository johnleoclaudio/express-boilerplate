import config from 'config';

const containerPath: string = config.get('application.layerPathFromLambda');
const container = require(containerPath).default;
const Types = require(`${containerPath}/types`).default;

exports.retryKyc = async (event: any) => {
  let response;

  try {
    const { Authorization: access_token } = event.headers;

    const { type, group } = event.pathParameters;

    const tokenChecker = container.get(Types.AdminCheckToken);

    const { owner: admin } = await tokenChecker.execute({
      accessToken: access_token,
      type,
      group,
    });

    const allowedRoles = ['cs_checker', 'cs_maker'];

    if (!allowedRoles.includes(admin.role)) {
      throw {
        code: 'RoleMismatch',
        message: 'Role Mismatch',
      };
    }

    const retryKyc = container.get(Types.RetryKyc);
    const { userId, fields, remarks } = JSON.parse(event.body);

    const data = await retryKyc.execute({
      userId,
      adminId: admin.id,
      fields,
      remarks,
    });

    response = {
      body: {
        data,
        status: 'success',
      },
      statusCode: 200,
    };
  } catch (err) {
    console.log('Error:', err);
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
