import config from 'config';

const containerPath: string = config.get('application.layerPathFromLambda');
const container = require(containerPath).default;
const Types = require(`${containerPath}/types`).default;
const encryptResponse = require(`${containerPath}/utils/encrypt`).default;

exports.refreshToken = async (event: any) => {
  let response;
  try {
    const { refreshToken, type } = JSON.parse(event.body);
    const tokenRefresher = container.get(Types.UserRefreshToken);
    const bondUserRefresher = container.get(Types.BondUserRefreshToken);
    const adminRefreshToken = container.get(Types.AdminRefreshToken);
    const clientRefreshToken = container.get(Types.ClientRefreshToken);

    let data;

    if (type == 'pixo') {
      throw {
        code: 'InvalidRefreshTokenRequest',
        message: 'Invalid Request',
      };
      // data = await tokenRefresher.execute({
      //   refreshToken,
      //   type,
      // });
    } else if (type == 'payments') {
      console.log('this happened');
      data = await clientRefreshToken.execute({
        refreshToken,
        type: 'client',
        scope: type,
      });
    } else if (type == 'bond_user') {
      // TODO
      data = await bondUserRefresher.execute({
        refreshToken,
        type,
      });
      // throw {
      //   code: 'InvalidRequest',
      //   message: 'Invalid Request',
      // };
    } else if (type == 'admin') {
      data = await adminRefreshToken.execute({
        refreshToken,
        type,
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
