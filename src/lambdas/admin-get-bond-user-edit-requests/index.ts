import config from 'config';
import { Op } from 'sequelize';

const containerPath: string = config.get('application.layerPathFromLambda');
const container = require(containerPath).default;
const Types = require(`${containerPath}/types`).default;

exports.adminGetBondUserEditRequests = async (event: any) => {
  let response;
  try {
    const { Authorization: access_token } = event.headers;
    const { type, group } = event.pathParameters;

    const tokenChecker = container.get(Types.AdminCheckToken);

    const admin = await tokenChecker.execute({
      accessToken: access_token,
      type,
      group,
    });

    if (admin.owner.accessLevel < 1) {
      throw {
        code: 'RoleMismatch',
        message: 'Role Mismatch',
      };
    }

    const infoEditRequestDb = container.get(Types.InfoEditRequestDataSource);

    const paginate = (query, { page, pageSize }) => {
      const offset = (page - 1) * pageSize;
      const limit = pageSize;

      return {
        ...query,
        offset,
        limit,
      };
    };

    const defaultValues = {
      page: 1,
      pageSize: 100,
      status: null,
      userId: null,
    };

    const { page = 1, pageSize = 100, status = null, userId = null } = {
      ...defaultValues,
      ...event.queryStringParameters,
    };

    const validStatus = ['pending', 'approved', 'rejected', 'fulfilled', null];

    if (!validStatus.includes(status)) {
      throw {
        code: 'StatusNotSupportedError',
        message: 'Provided status is not supported',
      };
    }

    let query;

    // Get all pending requests
    if (status === 'pending') {
      query = {
        order: [['createdAt', 'ASC']],
        where: { declinedAt: null, approvedAt: null },
      };
    }

    // Get all approved requests
    if (status === 'approved') {
      query = {
        order: [['createdAt', 'ASC']],
        where: {
          declinedAt: null,
          approvedAt: {
            [Op.ne]: null,
          },
        },
      };
    }

    // Get all rejected requests
    if (status === 'rejected') {
      query = {
        order: [['createdAt', 'ASC']],
        where: {
          approvedAt: null,
          declinedAt: {
            [Op.ne]: null,
          },
        },
      };
    }

    // Get all approved and rejected requests
    if (status === 'fulfilled') {
      query = {
        order: [['createdAt', 'ASC']],
        where: {
          [Op.or]: [
            {
              approvedAt: {
                [Op.ne]: null,
              },
            },
            {
              declinedAt: {
                [Op.ne]: null,
              },
            },
          ],
        },
      };
    }

    // Get all requests
    if (status === null) {
      query = {
        order: [['createdAt', 'ASC']],
      };
    }

    const queryV2 = userId
      ? { ...query, where: { ...query.where, ownerId: userId } }
      : query;

    const data = await infoEditRequestDb.findAndCountAll(
      paginate(queryV2, { page, pageSize }),
    );

    const formattedData = data.rows.map(item => {
      let status;
      const isApproved = !item.declinedAt && item.approvedAt;
      const isRejected = item.declinedAt && !item.approvedAt;
      const isPending = !item.declinedAt && !item.approvedAt;

      if (isApproved) {
        status = 'approved';
      }
      if (isRejected) {
        status = 'rejected';
      }
      if (isPending) {
        status = 'pending';
      }

      const {
        id,
        ownerId,
        ownerType,
        editedCategory,
        editedField,
        editedFieldPreviousInfo,
        editedFieldNewInfo,
        editedAt,
        editedBy,
        editReason,
        approvedAt,
        approvedBy,
        approvalComment,
        declinedAt,
        declinedBy,
        denialComment,
        details,
        createdAt,
        updatedAt,
      } = item;

      return {
        id,
        ownerId,
        ownerType,
        editedCategory,
        editedField,
        editedFieldPreviousInfo,
        editedFieldNewInfo,
        editedAt,
        editedBy,
        editReason,
        approvedAt,
        approvedBy,
        approvalComment,
        declinedAt,
        declinedBy,
        denialComment,
        details,
        createdAt,
        updatedAt,
        status,
      };
    });

    response = {
      body: {
        data: {
          count: data.count,
          rows: formattedData,
        },
        status: 'success',
        meta: { page, totalItems: data.count, pageSize },
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
