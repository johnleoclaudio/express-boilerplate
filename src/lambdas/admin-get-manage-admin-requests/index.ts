import config from 'config';
import { Op } from 'sequelize';

const containerPath: string = config.get('application.layerPathFromLambda');
const container = require(containerPath).default;
const Types = require(`${containerPath}/types`).default;

exports.adminGetManageAdminRequests = async (event: any) => {
  let response;
  // LOGGER
  const logger = container.get(Types.LoggerService);
  const loggerParams = {
    layer: 'lambda',
    name: 'adminGetManageAdminRequests',
    type: 'request',
    message: event,
  };
  logger.execute(loggerParams);
  // LOGGER
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

    const db = container.get(Types.AdminManageRequestDataSource);

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
    };

    const { page = 1, pageSize = 100, status = null } = {
      ...defaultValues,
      ...event.queryStringParameters,
    };

    const validStatus = ['pending', 'approved', 'rejected', null];

    if (!validStatus.includes(status)) {
      throw {
        code: 'StatusNotSupportedError',
        message: 'Provided status is not supported',
      };
    }

    let query: any = {
      order: [['createdAt', 'ASC']],
      attributes: [
        'id',
        'approvedAt',
        'rejectedAt',
        'requestedAt',
        'scope',
        'type',
      ],
    };

    switch (status) {
      case 'pending':
        query = {
          ...query,
          where: { rejectedAt: null, approvedAt: null },
        };
        break;
      case 'approve':
        query = {
          ...query,
          where: {
            rejectedAt: null,
            approvedAt: {
              [Op.ne]: null,
            },
          },
        };
        break;
      case 'rejected':
        query = {
          ...query,
          where: {
            approvedAt: null,
            rejectedAt: {
              [Op.ne]: null,
            },
          },
        };
        break;
      default:
        break;
    }

    const data = await db.findAndCountAll(paginate(query, { page, pageSize }));

    interface IRequest {
      id: number;
      approvedAt: Date;
      rejectedAt: Date;
      requestedAt: Date;
      scope: string;
      type: string;
    }

    interface FormattedData extends IRequest {
      status: string;
    }

    const formattedData: FormattedData[] = data.rows.map(
      (request: IRequest) => {
        const {
          id,
          approvedAt,
          rejectedAt,
          requestedAt,
          scope,
          type,
        } = request;
        const rejected = rejectedAt;
        const approved = approvedAt;

        const isApproved = !rejected && approved;
        const isRejected = rejected && !approved;
        const isPending = !rejected && !approved;

        let status: string = '';

        if (isApproved) {
          status = 'approved';
        } else if (isRejected) {
          status = 'rejected';
        } else if (isPending) {
          status = 'pending';
        }

        return {
          id,
          approvedAt,
          rejectedAt,
          requestedAt,
          scope,
          type,
          status,
        };
      },
    );

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
