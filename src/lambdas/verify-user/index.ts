import config from 'config';

const containerPath: string = config.get('application.layerPathFromLambda');
const container = require(containerPath).default;
const Types = require(`${containerPath}/types`).default;

exports.verify = async (event: any) => {
  let response;

  try {
    const { code, user, type } = event.queryStringParameters;

    if (type !== 'bond_user') {
      throw {
        code: 'InvalidVerifyUserError',
        message: 'Request is invalid.',
      };
    }

    // TODO: Add support for other user type
    const verifier = container.get(Types.BondUserVerifier);

    const res = await verifier.execute({
      code,
      secureId: user,
    });

    const data = {
      verifiedAt: res[1][0].verifiedAt,
    };

    if (!res[0]) {
      throw {
        code: 'InvalidVerifyUserError',
        message: 'Request is invalid.',
      };
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
        'Origin, X-Requested-With, Content-Type, Accept,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,access_token,X-Access-Token',
    },
    statusCode: response.statusCode,
    body: JSON.stringify(response.body),
  };
};
