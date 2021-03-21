import config from 'config';

const containerPath: string = config.get('application.layerPathFromLambda');
const container = require(containerPath).default;
const Types = require(`${containerPath}/types`).default;
const encryptResponse = require(`${containerPath}/utils/encrypt`).default;

exports.loginUser = async (event: any) => {
  let response;
  let safeResponse;
  const { password, ...rest } = JSON.parse(event.body);
  const logger = container.get(Types.LoggerService);
  const loggerParams = {
    layer: 'lambda',
    name: 'loginUser',
    type: 'request',
    message: { ...event, body: { ...rest } }, // TODO: Remove later
  };
  logger.execute(loggerParams);
  try {
    // const { username, password, deviceId, otp } = JSON.parse(event.body);
    const userLogin = container.get(Types.UserLogin);
    const {
      refreshToken,
      accessToken,
      expiresAt,
      payload,
    } = await userLogin.execute({
      password,
      ...rest,
    });

    const data = {
      refreshToken,
      accessToken,
      expiresAt,
      payload,
    };

    safeResponse = {
      body: {
        data: {
          refreshToken,
          accessToken,
          expiresAt,
        },
        status: 'success',
      },
      statusCode: 200,
    };

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

    safeResponse = response;
  }

  logger.execute({
    ...loggerParams,
    message: safeResponse,
    type: 'response',
  });

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
