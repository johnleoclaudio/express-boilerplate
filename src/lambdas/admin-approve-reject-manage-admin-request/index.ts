import config from 'config';

const containerPath: string = config.get('application.layerPathFromLambda');
const container = require(containerPath).default;
const Types = require(`${containerPath}/types`).default;

exports.adminApproveRejectManageAdminRequest = async (event: any) => {
  let response;
  // LOGGER
  const logger = container.get(Types.LoggerService);
  const loggerParams = {
    layer: 'lambda',
    name: 'adminApproveRejectManageAdminRequest',
    type: 'request',
    message: event,
  };
  logger.execute(loggerParams);
  // LOGGER

  const dbTransaction = container.get(Types.DbTransaction);
  const dbTxn = await dbTransaction.transaction();

  try {
    const { Authorization: accessToken } = event.headers;
    const { type, group } = event.pathParameters;

    const tokenChecker = container.get(Types.AdminCheckToken);

    // check if super admin
    const admin = await tokenChecker.execute({
      accessToken,
      type, // TBD for Super Admins
      group, // TBD for Super Admins
    });

    const { id: adminId, accessLevel, role } = admin?.owner;

    if (
      accessLevel < 3 &&
      role === 'system_admin' // TBD
    ) {
      throw {
        code: 'RoleMismatch',
        message: 'Role Mismatch',
      };
    }

    const { action } = event.pathParameters;
    const params = JSON.parse(event.body);

    const approveRejectRequest = container.get(
      Types.ApproveRejectManageAdminRequest,
    );

    const result = await approveRejectRequest.execute(
      { adminId, action, ...params },
      dbTxn,
    );

    await dbTxn.commit();

    response = {
      body: {
        data: result,
        status: 'success',
      },
      statusCode: 200,
    };
  } catch (err) {
    await dbTxn.rollback();
    console.log('errObject', err);
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
