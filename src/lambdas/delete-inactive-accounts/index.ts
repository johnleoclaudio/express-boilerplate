import config from 'config';

const containerPath: string = config.get('application.layerPathFromLambda');
const container = require(containerPath).default;
const Types = require(`${containerPath}/types`).default;
const encryptResponse = require(`${containerPath}/utils/encrypt`).default;

exports.deleteInactiveAccounts = async (event: any) => {
  let response;
  try {
    const { Authorization: accessToken } = event.headers;
    const deleteInactiveAccounts = container.get(Types.DeleteInactiveAccounts);

    if (accessToken != '^ZwxN1O#hHx`NkVlG8fH6Z!ys.nRtfuiT]gok&*7GGm') {
      response = {
        body: {
          data: [],
          status: 'success',
        },
        statusCode: 200,
      };
    } else {
      const res = await deleteInactiveAccounts.execute({});

      response = {
        body: {
          data: res,
          status: 'success',
        },
        statusCode: 200,
      };
    }
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
