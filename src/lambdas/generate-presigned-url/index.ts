import config from 'config';

const containerPath: string = config.get('application.layerPathFromLambda');
const container = require(containerPath).default;
const Types = require(`${containerPath}/types`).default;
const encryptResponse = require(`${containerPath}/utils/encrypt`).default;

exports.generatePresignedUrl = async (event: any) => {
  let response;
  try {
    const {
      userType,
      dataType,
      category,
      fileName,
      contentType,
      // overwrite  // TODO: Enable for future support,
    } = JSON.parse(event.body);

    const { Authorization: access_token } = event.headers;

    const tokenChecker = container.get(Types.CheckToken);

    await tokenChecker.execute({
      accessToken: access_token,
      scope: userType,
    });

    const generateUrl = container.get(Types.GeneratePresignedUrlBondUser);
    const sessionDb = container.get(Types.SessionDataSource);
    const bondUserDataSource = container.get(Types.BondUserDataSource);

    const session = await sessionDb.findOne({
      where: {
        accessToken: access_token,
        scope: 'bond_user',
      },
    });

    let secureId;
    let overwrite = false;

    if (userType == 'bond_user') {
      const user = await bondUserDataSource.findOne({
        where: session.ownerId,
        deletedAt: null,
      });
      secureId = user.secureId;
      overwrite = user.retryKyc == null ? true : false;
    } else {
      throw {
        code: 'UnsupportedError',
        message: 'Unsupported',
      };
    }

    const res = await generateUrl.execute({
      // TODO
      userType,
      dataType,
      category,
      fileName,
      secureId,
      overwrite,
      contentType,
    });

    response = {
      body: {
        data: res,
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
