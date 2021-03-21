import config from 'config';
import { Op } from 'sequelize';

const containerPath: string = config.get('application.layerPathFromLambda');
const container = require(containerPath).default;
const Types = require(`${containerPath}/types`).default;
const encryptResponse = require(`${containerPath}/utils/encrypt`).default;

exports.systemSyncUserData = async (event: any) => {
  let response;
  try {
    const { Authorization: accessToken } = event.headers;
    const { secureIds } = JSON.parse(event.body);

    const bondUserDataSource = container.get(Types.BondUserDataSource);
    const additionalInfoDataSource = container.get(
      Types.AdditionalInfoDataSource,
    );

    if (accessToken != '^ZwxN1O#hHx`NkVlG8fH6Z!ys.nRtfuiT]gok&*7GGm') {
      response = {
        body: {
          data: [],
          status: 'success',
        },
        statusCode: 200,
      };
    } else {
      let res: any = [];

      const bondUserList = await bondUserDataSource.find({
        where: {
          secureId: { [Op.in]: secureIds },
        },
        attributes: ['id', 'contactNumber', 'secureId'],
        order: [['id', 'DESC']],
      });

      const userIds = bondUserList.map(item => item.id);

      const kycRes = await additionalInfoDataSource.find({
        where: {
          type: 'kyc',
          ownerId: { [Op.in]: userIds },
          ownerType: 'bond_user',
        },
        order: [['ownerId', 'DESC']],
      });

      let offset = 0;
      for (let index = 0; index < bondUserList.length; index++) {
        const bondUser = bondUserList[index];
        const kycOwnerId = kycRes[index - offset]?.ownerId || 0;

        if (bondUser.id != kycOwnerId) {
          offset++;
          res.push({
            secureId: bondUser?.secureId,
            contactNumber: '',
            firstName: '',
            lastName: '',
            middleName: '',
            birthday: '',
          });
        } else {
          const kycDetails = kycRes[index - offset]?.details;
          // const kycDetails = kycRes[index - offset]?.details;
          // TODO: Add more information as required
          res.push({
            secureId: bondUser?.secureId,
            contactNumber: bondUser?.contactNumber || '',
            firstName: kycDetails?.personalInfo?.firstName || '',
            lastName: kycDetails?.personalInfo?.lastName || '',
            middleName: kycDetails?.personalInfo?.middleName || '',
            birthday: kycDetails?.personalInfo?.birthday || '',
            // TODO: Added for cash out
            zip: kycDetails?.address?.present?.zip || '',
            city: kycDetails?.address?.present?.city || '',
            lineA: kycDetails?.address?.present?.lineA || '',
            lineB: kycDetails?.address?.present?.lineB || '',
            country: kycDetails?.address?.present?.country || '',
            regionState: kycDetails?.address?.present?.regionState || '',
          });
        }
      }

      response = {
        body: {
          data: res,
          status: 'success',
        },
        statusCode: 200,
      };
    }
  } catch (err) {
    console.log('da err:', err);
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
