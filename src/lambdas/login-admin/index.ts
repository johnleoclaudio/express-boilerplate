import config from 'config';

const containerPath: string = config.get('application.layerPathFromLambda');
const container = require(containerPath).default;
const Types = require(`${containerPath}/types`).default;

// TODO: Fix
exports.loginAdmin = async (event: any) => {
  let response;
  const { password, token, ...rest } = JSON.parse(event.body);
  const { scope } = event.pathParameters;
  const logger = container.get(Types.LoggerService);
  const loggerParams = {
    layer: 'lambda',
    name: 'loginAdmin',
    type: 'request',
    message: { ...event, body: { ...rest } }, // TODO: Remove later
  };
  logger.execute(loggerParams);
  const dbTransaction: any = container.get(Types.DbTransaction);
  const dbTxn = await dbTransaction.transaction();

  try {
    const adminLogin = container.get(Types.AdminLogin);
    const data = await adminLogin.execute(
      {
        password,
        scope,
        token,
        ownerType: 'admin',
        username: rest.username,
      },
      { dbTxn },
    );

    data.email = rest.username;

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
