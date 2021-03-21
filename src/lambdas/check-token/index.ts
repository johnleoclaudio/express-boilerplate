// tOD

// bond/admin/ops_checker
import config from 'config';

const containerPath: string = config.get('application.layerPathFromLambda');
const container = require(containerPath).default;
const Types = require(`${containerPath}/types`).default;
const encryptResponse = require(`${containerPath}/utils/encrypt`).default;

exports.checkToken = async (event: any) => {
  let response;
  try {
    const { accessToken } = JSON.parse(event.body);
    const { type, group, role } = event.pathParameters;
    const adminTokenChecker = container.get(Types.AdminCheckToken);
    const checkToken = container.get(Types.CheckToken);

    let data;
    if (group === 'admin') {
      data = await adminTokenChecker.execute({
        accessToken,
        type, // bond
        group, // admin
        role, // ops_maker
      });
    } else if (group === 'user') {
    }
    // client/payments/payments/check
    else if (type === 'client' && group === 'payments') {
      data = await checkToken.execute({
        accessToken,
        scope: 'payments',
      });
    }

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
