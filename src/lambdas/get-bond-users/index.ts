import config from 'config';
import { Op } from 'sequelize';

const containerPath: string = config.get('application.layerPathFromLambda');
const container = require(containerPath).default;
const Types = require(`${containerPath}/types`).default;

exports.getBondUsers = async (event: any) => {
  let response;

  const paginate = (query, { page, pageSize }) => {
    const offset = (page - 1) * pageSize;
    const limit = pageSize;

    return {
      ...query,
      offset,
      limit,
    };
  };

  // TODO: Verify default page and pageSize values
  const defaultValues = {
    kyc: null,
    keyword: null,
    page: 1,
    pageSize: 100,
    attribute: null,
    blockOtp: null,
    blockLogin: null,
    blockTxnOtp: null,
    blockWithdraw: null,
    blockTrade: null,
    dateTo: null,
    dateFrom: null,
  };

  const {
    kyc = null,
    page = 1,
    pageSize = 100,
    keyword = null,
    attribute = null,
    blockOtp = null,
    blockLogin = null,
    blockTxnOtp = null,
    blockWithdraw = null,
    blockTrade = null,
    dateTo = null,
    dateFrom = null,
  } = {
    ...defaultValues,
    ...event.queryStringParameters,
  };

  const additionalQuery = keyword
    ? {
        [Op.or]: [
          { firstName: { [Op.iLike]: `%${keyword}%` } },
          { lastName: { [Op.iLike]: `%${keyword}%` } },
          { email: { [Op.iLike]: `%${keyword}%` } },
          { secureId: { [Op.iLike]: `%${keyword}%` } },
        ],
      }
    : {};

  console.log('params', kyc);

  try {
    // const { accessToken } = JSON.parse(event.body);
    const { Authorization: accessToken } = event.headers;
    // const { type, group, role } = event.pathParameters;
    const { type, group } = event.pathParameters;
    const tokenChecker = container.get(Types.AdminCheckToken);

    const auth = await tokenChecker.execute({
      accessToken,
      type, // bond
      group, // admin
    });

    const bondUserDataSource = container.get(Types.BondUserDataSource);

    if (
      auth.owner.role !== 'cs_maker' &&
      auth.owner.role !== 'cs_checker' &&
      auth.owner.role !== 'ops_checker' &&
      auth.owner.role !== 'ops_maker' &&
      auth.owner.accessLevel < 1
    ) {
      throw {
        code: 'RoleMismatch',
        message: 'Role Mismatch',
      };
    }
    let attributes = [
      'id',
      'email',
      'firstName',
      'lastName',
      'contactNumber',
      'secureId',
      'kycFinishedAt',
      'kycApprovedAt',
      'kycApprovedBy',
      'kycVerifiedAt',
      'kycVerifiedBy',
      'riskRating',
      'retryKyc',
      'verifiedAt',
      'blockOtp',
      'blockLogin',
      'blockRequireTxnOtp',
      'blockTxnOtp',
      'blockWithdraw',
      'blockTrade',
    ];

    if (attribute) {
      attributes = [attribute];
    }

    let query;

    // Get all
    if (kyc === null || kyc === 'all') {
      query = {
        attributes,
        order: [['createdAt', 'DESC']],
        where: {
          deletedAt: null,
          createdAt:
            dateFrom && dateTo
              ? {
                  [Op.between]: [dateFrom, dateTo],
                }
              : {
                  [Op.ne]: null,
                },
          ...additionalQuery,
        },
      };
    }

    // Get submitted
    if (kyc === 'submitted') {
      query = {
        attributes,
        where: {
          kycFinishedAt:
            dateFrom && dateTo
              ? {
                  [Op.between]: [dateFrom, dateTo],
                }
              : {
                  [Op.ne]: null,
                },
          kycApprovedAt: null,
          kycVerifiedAt: null,
          deletedAt: null,
          retryKyc: false,
          ...additionalQuery,
        },
        order: [['createdAt', 'DESC']],
      };
    }

    // Get approved
    if (kyc === 'approved') {
      query = {
        attributes,
        where: {
          kycApprovedAt:
            dateFrom && dateTo
              ? {
                  [Op.between]: [dateFrom, dateTo],
                }
              : {
                  [Op.ne]: null,
                },
          kycVerifiedAt: null,
          deletedAt: null,
          // retryKyc: false,
          ...additionalQuery,
        },
        order: [['createdAt', 'DESC']],
      };
    }

    // get approved and verified
    if (kyc === 'verified') {
      query = {
        attributes,
        where: {
          kycApprovedAt: {
            [Op.ne]: null,
          },
          kycVerifiedAt:
            dateFrom && dateTo
              ? {
                  [Op.between]: [dateFrom, dateTo],
                }
              : {
                  [Op.ne]: null,
                },
          deletedAt: null,
          // retryKyc: false,
          ...additionalQuery,
        },
        order: [['createdAt', 'DESC']],
      };
    }

    // get rejected
    if (kyc === 'rejected') {
      query = {
        attributes,
        where: {
          kycApprovedAt: null,
          kycVerifiedAt: null,
          deletedAt: null,
          retryKyc: true,
          ...additionalQuery,
        },
        order: [['createdAt', 'DESC']],
      };
    }

    // get new
    if (kyc === 'new') {
      query = {
        attributes,
        where: {
          kycFinishedAt: null,
          deletedAt: null,
          kycApprovedAt: null,
          kycVerifiedAt: null,
          createdAt:
            dateFrom && dateTo
              ? {
                  [Op.between]: [dateFrom, dateTo],
                }
              : {
                  [Op.ne]: null,
                },
          ...additionalQuery,
        },
        order: [['createdAt', 'DESC']],
      };
    }

    // get put to draft
    if (kyc === 'draft') {
      query = {
        attributes,
        where: {
          retryKyc: true,
          kycVerifiedAt: null,
          deletedAt: null,
          putToDraftAt:
            dateFrom && dateTo
              ? {
                  [Op.between]: [dateFrom, dateTo],
                }
              : {
                  [Op.ne]: null,
                },
          ...additionalQuery,
        },
        order: [['createdAt', 'DESC']],
      };
    }

    if (blockLogin != null) {
      query.where['blockLogin'] = blockLogin;
    }
    if (blockOtp != null) {
      query.where['blockOtp'] = blockOtp;
    }
    if (blockTxnOtp != null) {
      query.where['blockTxnOtp'] = blockTxnOtp;
    }
    if (blockWithdraw != null) {
      query.where['blockWithdraw'] = blockWithdraw;
    }
    if (blockTrade != null) {
      query.where['blockTrade'] = blockTrade;
    }

    const items = await bondUserDataSource.findAndCountAll(
      paginate(query, { page, pageSize }),
    );

    // console.log('items: ', items);
    response = {
      body: {
        data: items.rows,
        status: 'success',
        meta: { page, totalItems: items.count, pageSize },
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
