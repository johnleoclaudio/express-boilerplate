import config from 'config';
import { Op } from 'sequelize';

const containerPath: string = config.get('application.layerPathFromLambda');
const container = require(containerPath).default;
const Types = require(`${containerPath}/types`).default;

exports.getBondUsersStats = async (event: any) => {
  let response: any;
  const logger = container.get(Types.LoggerService);
  const loggerParams = {
    layer: 'lambda',
    name: 'getS3FilesList',
    type: 'request',
    message: event,
  };
  logger.execute(loggerParams);
  try {
    const { Authorization: accessToken } = event.headers;
    const { type, group } = event.pathParameters;

    const AdminCheckToken = container.get(Types.AdminCheckToken);

    const admin = await AdminCheckToken.execute({
      accessToken,
      type,
      group,
    });

    if (admin.owner.accessLevel < 1) {
      throw {
        code: 'RoleMismatch',
        message: 'Role Mismatch',
      };
    }

    const bondUserDataSource = container.get(Types.BondUserDataSource);
    const additionalInfoDataSource = container.get(
      Types.AdditionalInfoDataSource,
    );

    const numberOfVerifiedEmails = await bondUserDataSource.count({
      where: {
        deletedAt: null,
        verifiedAt: {
          [Op.ne]: null,
        },
      },
    });

    const numberOfRegisteredUsers = await bondUserDataSource.count({
      where: {
        deletedAt: null,
      },
    });

    const numberOfMakerApprovedUsers = await bondUserDataSource.count({
      where: {
        deletedAt: null,
        kycApprovedAt: {
          [Op.ne]: null,
        },
      },
    });

    const numberOfCheckerVerifiedUsers = await bondUserDataSource.count({
      where: {
        deletedAt: null,
        kycVerifiedAt: {
          [Op.ne]: null,
        },
      },
    });

    const numberOfPutToDraftUsers = await bondUserDataSource.count({
      where: {
        deletedAt: null,
        retryKyc: true,
      },
    });

    const numberOfFinishedKYC = await bondUserDataSource.count({
      where: {
        deletedAt: null,
        kycFinishedAt: {
          [Op.ne]: null,
        },
      },
    });
    const numberOfSubmittedKYC = await additionalInfoDataSource.count({
      where: {
        type: 'kyc',
      },
    });

    response = {
      body: {
        data: {
          numberOfVerifiedEmails,
          numberOfRegisteredUsers,
          numberOfMakerApprovedUsers,
          numberOfCheckerVerifiedUsers,
          numberOfPutToDraftUsers,
          numberOfFinishedKYC,
          numberOfSubmittedKYC,
        },
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
