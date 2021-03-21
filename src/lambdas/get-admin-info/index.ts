import config from 'config';
import { addDays } from 'date-fns';

const containerPath: string = config.get('application.layerPathFromLambda');
const adminPasswordExpiryInDays: number = config.get(
  'application.adminPasswordExpiryInDays',
);
const container = require(containerPath).default;
const Types = require(`${containerPath}/types`).default;
const encryptResponse = require(`${containerPath}/utils/encrypt`).default;

exports.getAdminInfo = async (event: any) => {
  let response;
  try {
    const { Authorization: access_token } = event.headers;
    const { type, group } = event.pathParameters;

    const sessionDataSource = container.get(Types.SessionDataSource);
    const adminDataSource = container.get(Types.AdminDataSource);

    // TODO: Verify this fix - START
    const tokenChecker = container.get(Types.AdminCheckToken);

    await tokenChecker.execute({
      accessToken: access_token,
      type, // bond
      group, // admin
    });
    // TODO: Verify this fix - END

    const sessionRes = await sessionDataSource.findOne({
      where: {
        accessToken: access_token,
        scope: type,
        ownerType: group,
      },
    });

    if (!sessionRes) {
      throw {
        code: 'InvalidAccessToken',
        message: 'Access Token is invalid',
      };
    }

    // TODO: Add future data source types if ever
    const adminRes = await adminDataSource.findOne({
      where: {
        id: sessionRes.ownerId,
      },
    });

    const data = adminRes.dataValues;
    data['passwordExpiresAt'] = new Date(
      addDays(new Date(data.passwordUpdatedAt), adminPasswordExpiryInDays),
    );
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
