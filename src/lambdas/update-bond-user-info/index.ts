import config from 'config';

const containerPath: string = config.get('application.layerPathFromLambda');
const container = require(containerPath).default;
const Types = require(`${containerPath}/types`).default;

exports.updateBondUserInfo = async (event: any) => {
  let response;

  try {
    const { Authorization: access_token } = event.headers;
    const params = JSON.parse(event.body);

    const tokenChecker = container.get(Types.CheckToken);

    await tokenChecker.execute({
      accessToken: access_token,
      scope: 'bond_user',
    });

    const updateBondUserInfo = container.get(Types.UpdateBondUserInfo);

    const updateBondUserInfoResponse = await updateBondUserInfo.execute({
      ...params,
      accessToken: access_token,
    });

    // filter out sensitive bond user information
    const data = updateBondUserInfoResponse.dataValues;
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
