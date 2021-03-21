import config from 'config';

const containerPath: string = config.get('application.layerPathFromLambda');
const container = require(containerPath).default;
const Types = require(`${containerPath}/types`).default;

exports.createTwoFaBondUser = async (event: any) => {
  let response;
  const logger = container.get(Types.LoggerService);
  const loggerParams = {
    layer: 'lambda',
    name: 'CreateTwoFaBondUser',
    type: 'request',
    message: event,
  };
  logger.execute(loggerParams);
  const dbTransaction: any = container.get(Types.DbTransaction);
  const dbTxn = await dbTransaction.transaction();
  try {
    const tokenChecker = container.get(Types.CheckToken);
    const sessionDataSource = container.get(Types.SessionDataSource);

    const { Authorization: access_token } = event.headers;

    await tokenChecker.execute({
      accessToken: access_token,
      scope: 'bond_user',
    });

    const { ownerId: userId } = await sessionDataSource.findOne({
      where: {
        accessToken: access_token,
        ownerType: 'bond_user',
      },
    });

    const createTwoFa = container.get(Types.CreateTwoFaSecret);

    const data = await createTwoFa.execute(
      {
        userId,
        userType: 'bond_user',
      },
      { dbTxn },
    );

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
        'Origin, X-Requested-With, Content-Type, Accept,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,access_token,X-Access-Token',
    },
    statusCode: response.statusCode,
    body: JSON.stringify(response.body),
  };
};
