import config from 'config';

const containerPath: string = config.get('application.layerPathFromLambda');
const container = require(containerPath).default;
const Types = require(`${containerPath}/types`).default;

exports.batchGenerateInvestorReport = async (event: any) => {
  let response;
  const logger = container.get(Types.LoggerService);
  const loggerParams = {
    layer: 'lambda',
    name: 'batchGenerateInvestorReport',
    type: 'request',
    message: event,
  };
  logger.execute(loggerParams);

  try {
    const GenerateInvestorInformation: any = container.get(
      Types.GenerateInvestorInformation,
    );

    const data = await GenerateInvestorInformation.execute({
      type: 'automated',
      csvReported: false,
    });

    response = {
      body: {
        data,
        status: 'success',
      },
      statusCode: 200,
    };
  } catch (error) {
    response = {
      body: {
        data: error,
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
        'Origin, X-Requested-With, Content-Type, Accept,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
    },
    statusCode: 200,
    body: JSON.stringify(response.body),
  };
};
