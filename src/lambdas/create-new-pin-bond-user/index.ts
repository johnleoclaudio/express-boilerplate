import config from 'config';

const containerPath: string = config.get('application.layerPathFromLambda');
const container = require(containerPath).default;
const Types = require(`${containerPath}/types`).default;

exports.createNewPinBondUser = async (event: any) => {
  let response;
  const logger = container.get(Types.LoggerService);
  const loggerParams = {
    layer: 'lambda',
    name: 'createNewPinBondUser',
    type: 'request',
    message: event,
  };
  logger.execute(loggerParams);
  try {
    const { Authorization: access_token } = event.headers;
    const params = JSON.parse(event.body);

    const createNewPinFeature = container.get(Types.CreateNewPinBondUser);

    const data = await createNewPinFeature.execute({
      ...params,
      accessToken: access_token,
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
