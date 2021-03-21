import config from 'config';

const containerPath: string = config.get('application.layerPathFromLambda');
const container = require(containerPath).default;
const Types = require(`${containerPath}/types`).default;
const encryptResponse = require(`${containerPath}/utils/encrypt`).default;

exports.createTransactionOtp = async (event: any) => {
  let response;
  const dbTransaction: any = container.get(Types.DbTransaction);
  const dbTxn = await dbTransaction.transaction();
  try {
    const { Authorization: accessToken } = event.headers;
    const { userType, transactionType } = event.pathParameters;

    const createTransactionOtp = container.get(
      Types.CreateTransactionOtpBondUser,
    );

    if (userType !== 'bond_user') {
      throw {
        code: 'InvalidCreateOtpRequest',
        message: 'Invalid Request',
      };
    }

    const tokenChecker = container.get(Types.CheckToken);

    await tokenChecker.execute({
      accessToken,
      scope: 'bond_user',
    });

    const otpRes = await createTransactionOtp.execute(
      {
        accessToken,
        transactionType,
      },
      { dbTxn },
    );
    await dbTxn.commit();
    response = {
      body: {
        data: otpRes,
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
        'Origin, X-Requested-With, Content-Type, Accept,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,access_token',
    },
    statusCode: response.statusCode,
    body: JSON.stringify(response.body),
  };
};
