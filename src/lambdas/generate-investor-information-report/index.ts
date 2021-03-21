import config from 'config';

const containerPath: string = config.get('application.layerPathFromLambda');
const container = require(containerPath).default;
const Types = require(`${containerPath}/types`).default;

exports.generateInvestorInformationReport = async (event: any) => {
  let response;
  try {
    const params = (event.body && JSON.parse(event.body)) || {};

    const { Authorization: access_token } = event.headers;
    const { type, group } = event.pathParameters;
    const tokenChecker = container.get(Types.AdminCheckToken);

    const admin = await tokenChecker.execute({
      accessToken: access_token,
      type,
      group,
    });

    if (admin.owner.accessLevel < 2) {
      throw {
        code: 'RoleMismatch',
        message: 'Role Mismatch',
      };
    }

    const GenerateInvestorInformation: any = container.get(
      Types.GenerateInvestorInformation,
    );

    const data = await GenerateInvestorInformation.execute({ type: 'manual' });

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
        'Origin, X-Requested-With, Content-Type, Accept,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,access_token',
    },
    statusCode: response.statusCode,
    body: JSON.stringify(response.body),
  };
};
