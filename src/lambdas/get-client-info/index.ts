import config from 'config';

const containerPath: string = config.get('application.layerPathFromLambda');
const container = require(containerPath).default;
const Types = require(`${containerPath}/types`).default;
const encryptResponse = require(`${containerPath}/utils/encrypt`).default;

exports.getClientInfo = async (event: any) => {
  let response;
  try {
    const { Authorization: access_token } = event.headers;

    const tokenChecker = container.get(Types.CheckToken);

    await tokenChecker.execute({
      accessToken: access_token,
      scope: 'payments',
    });

    const clientDataSource = container.get(Types.ClientDataSource);
    const sessionDataSource = container.get(Types.SessionDataSource);

    const { ownerId } = await sessionDataSource.findOne({
      where: {
        accessToken: access_token,
        ownerType: 'client',
      },
    });

    const clientData = await clientDataSource.findOne({
      where: {
        id: ownerId,
      },
    });

    const data = clientData.dataValues;
    data.username = data.email;
    delete data.email;
    delete data.password;

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
