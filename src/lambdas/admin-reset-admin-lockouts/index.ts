import config from 'config';

const containerPath: string = config.get('application.layerPathFromLambda');
const container = require(containerPath).default;
const Types = require(`${containerPath}/types`).default;

exports.adminResetAdminLockouts = async (event: any) => {
  let response;

  const dbTransaction: any = container.get(Types.DbTransaction);
  const dbTxn = await dbTransaction.transaction();

  try {
    const { Authorization: access_token } = event.headers;
    const { type, group } = event.pathParameters;
    const params = JSON.parse(event.body);

    const tokenChecker = container.get(Types.AdminCheckToken);

    const admin = await tokenChecker.execute({
      accessToken: access_token,
      type,
      group,
    });

    if (admin.owner.accessLevel < 3 && admin.owner.role == 'system_admin') {
      throw {
        code: 'RoleMismatch',
        message: 'Role Mismatch',
      };
    }

    const adminDb = container.get(Types.AdminDataSource);

    // add locks? add admin actions?
    const result = await adminDb.update(
      {
        blockLogin: false,
        loginRetry: 0,
        lastLoginAt: new Date(),
        // passwordUpdatedAt: new Date(),
      },
      {
        where: {
          username: params.username,
          // id: params.adminId,
        },
        transaction: dbTxn,
      },
    );

    const data = result[1];

    await dbTxn.commit();

    response = {
      body: {
        data,
        status: 'success',
      },
      statusCode: 200,
    };
  } catch (err) {
    await dbTxn.rollback();
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
