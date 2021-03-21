import config from 'config';

const containerPath: string = config.get('application.layerPathFromLambda');
const container = require(containerPath).default;
const Types = require(`${containerPath}/types`).default;

exports.logout = async (event: any) => {
  let response;

  const { Authorization: accessToken } = event.headers;
  const { type, group } = event.pathParameters;

  const logger = container.get(Types.LoggerService);
  const loggerParams = {
    layer: 'lambda',
    name: 'logout',
    type: 'request',
    message: event,
  };
  logger.execute(loggerParams);

  const dbTransaction: any = container.get(Types.DbTransaction);
  const dbTxn = await dbTransaction.transaction();

  try {
    let data;

    if (group === 'admin' && type === 'bond') {
      const tokenChecker = container.get(Types.AdminCheckToken);
      await tokenChecker.execute({
        accessToken,
        type,
        group,
      });
      const logoutAdmin = container.get(Types.AdminLogout);
      data = await logoutAdmin.execute(
        {
          accessToken,
          type,
          group,
        },
        { dbTxn },
      );
    } else if (group === 'user') {
      const logoutBondUser = container.get(Types.UserLogout);
      const tokenChecker = container.get(Types.CheckToken);

      let scope: string | null = null;
      let ownerType: string | null = null;

      if (type === 'bond') {
        scope = 'bond_user';
        ownerType = 'bond_user';
      } else if (type === 'pixo') {
        scope = 'pixo';
        ownerType = 'pixo';
      } else {
        throw {
          code: 'UnsupportedError',
          message: 'Unsupported error',
        };
      }

      if (type && ownerType) {
        await tokenChecker.execute({
          accessToken,
          scope,
        });

        data = await logoutBondUser.execute(
          {
            accessToken,
            scope,
            ownerType,
          },
          { dbTxn },
        );
      }
    }
    // TODO: Fix type and group later
    else if (type === 'client' && group === 'payments') {
      const clientLogout = container.get(Types.UserLogout);
      const tokenChecker = container.get(Types.CheckToken);

      await tokenChecker.execute({
        accessToken,
        scope: 'payments',
      });

      data = await clientLogout.execute(
        {
          accessToken,
          scope: 'payments',
          ownerType: 'client',
        },
        { dbTxn },
      );
    } else {
      throw {
        code: 'UnsupportedError',
        message: 'Unsupported error',
      };
    }

    dbTxn.commit();

    response = {
      body: {
        data,
        status: 'success',
      },
      statusCode: 200,
    };
  } catch (err) {
    dbTxn.rollback();
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
        'Origin, X-Requested-With, Content-Type, Accept,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,access_token',
    },
    statusCode: response.statusCode,
    body: JSON.stringify(response.body),
  };
};
