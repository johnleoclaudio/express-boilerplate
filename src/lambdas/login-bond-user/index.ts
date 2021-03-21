import config from 'config';

const containerPath: string = config.get('application.layerPathFromLambda');
const container = require(containerPath).default;
const Types = require(`${containerPath}/types`).default;

exports.loginBondUser = async (event: any) => {
  let response;
  const { password, ...rest } = JSON.parse(event.body);
  const logger = container.get(Types.LoggerService);
  const loggerParams = {
    layer: 'lambda',
    name: 'loginBondUser',
    type: 'request',
    message: { ...event, body: { ...rest } }, // TODO: Remove later
  };
  logger.execute(loggerParams);
  const dbTransaction: any = container.get(Types.DbTransaction);
  const dbTxn = await dbTransaction.transaction();
  try {
    const bondUserLogin = container.get(Types.BondUserLogin);
    // const {
    //   accessToken,
    //   refreshToken,
    //   expiresAt,
    // } = await bondUserLogin.execute({
    //   password,
    //   scope: 'bond_user',
    //   ownerType: 'bond_user',
    //   identifier: rest.username,
    // });

    const { session, payload } = await bondUserLogin.execute(
      {
        password,
        scope: 'bond_user',
        ownerType: 'bond_user',
        identifier: rest.username,
        deviceId: rest.deviceId,
      },
      { dbTxn },
    );

    const { refreshToken, accessToken, expiresAt } = session;

    const data = {
      refreshToken,
      accessToken,
      expiresAt,
      payload,
    };

    await dbTxn.commit();

    response = {
      body: {
        data,
        status: 'success',
      },
      statusCode: 200,
    };
  } catch (err) {
    await dbTxn.rollback();
    response = {
      body: {
        data: err,
        status: 'failed',
      },
      statusCode: 400,
    };
  }

  logger.execute({
    ...loggerParams,
    message: response,
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
