import config from 'config';

const containerPath: string = config.get('application.layerPathFromLambda');
const container = require(containerPath).default;
const Types = require(`${containerPath}/types`).default;
const encryptResponse = require(`${containerPath}/utils/encrypt`).default;

exports.approveKyc = async (event: any) => {
  let response;
  try {
    const { Authorization: access_token } = event.headers;
    const { type, group } = event.pathParameters;
    const { userId, action, remarks, riskRating } = JSON.parse(event.body);

    const tokenChecker = container.get(Types.AdminCheckToken);

    const tokenRes = await tokenChecker.execute({
      accessToken: access_token,
      type,
      group,
    });

    const allowedRoles = ['cs_checker', 'cs_maker'];

    if (!allowedRoles.includes(tokenRes.owner.role)) {
      throw {
        code: 'RoleMismatch',
        message: 'Role Mismatch',
      };
    }

    const adminActions = container.get(Types.ApproveKyc); // TODO: verify

    const data = await adminActions.execute({
      userId,
      action,
      remarks, // Optional
      riskRating,
      adminId: tokenRes.owner.id,
      role: tokenRes.owner.role,
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
