import config from 'config';
import db from '../../db';

const containerPath: string = config.get('application.layerPathFromLambda');
const container = require(containerPath).default;
const Types = require(`${containerPath}/types`).default;

exports.changePinBondUser = async (event: any) => {
  let response;
  const logger = container.get(Types.LoggerService);
  const loggerParams = {
    layer: 'lambda',
    name: 'changePinBondUser',
    type: 'request',
    message: event,
  };
  logger.execute(loggerParams);
  const dbTransaction: any = container.get(Types.DbTransaction);
  const dbTxn = await dbTransaction.transaction();
  try {
    const { Authorization: accessToken } = event.headers;
    const params = JSON.parse(event.body);

    const tokenChecker = container.get(Types.CheckToken);

    await tokenChecker.execute({
      accessToken,
      scope: 'bond_user',
    });

    const changePinFeature = container.get(Types.ChangePinBondUser);

    const data = await changePinFeature.execute(
      {
        ...params,
        accessToken,
      },
      dbTxn,
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
    await dbTxn.commit();
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
