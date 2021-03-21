import config from 'config';

const containerPath: string = config.get('application.layerPathFromLambda');
const container = require(containerPath).default;
const Types = require(`${containerPath}/types`).default;
const encryptResponse = require(`${containerPath}/utils/encrypt`).default;

exports.registerClient = async (event: any) => {
  let response;
  try {
    const {
      password,
      details,
      firstName = '',
      lastName = '',
      username,
      contactNumber = '',
    } = JSON.parse(event.body);
    const clientRegister = container.get(Types.ClientRegister);

    const data = await clientRegister.execute({
      email: username,
      password,
      details,
      firstName,
      lastName,
      contactNumber,
    });

    const json = data.dataValues;
    json.username = json.email;
    delete json.email;
    delete json.password;

    response = {
      body: {
        data: json,
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
