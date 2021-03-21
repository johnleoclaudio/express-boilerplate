import config from 'config';
import { Op, json } from 'sequelize';
import parsePhoneNumber from 'libphonenumber-js';

const containerPath: string = config.get('application.layerPathFromLambda');
const container = require(containerPath).default;
const Types = require(`${containerPath}/types`).default;

exports.systemFixUserContacts = async (event: any) => {
  let response;
  try {
    const bondUserDataSource = container.get(Types.BondUserDataSource);
    // REMOVE AFTER SYNCING USER FIRST & LAST NAMES
    const kycDb = container.get(Types.AdditionalInfoDataSource);

    // get additional infos using bond users's IDs
    const kyc = await kycDb.find({
      where: {
        type: 'kyc',
        ownerType: 'bond_user',
      },
      raw: true,
      attributes: [
        ['owner_id', 'id'],
        [json('details.personalInfo.lastName'), 'lastName'],
        [json('details.personalInfo.firstName'), 'firstName'],
      ],
    });

    const validData = kyc.filter(item => item.firstName && item.lastName);

    let res = null;

    if (validData.length) {
      const userIDs = validData.map(item => item.id);

      // get all bond users' IDs
      const bondUsersIDs = await bondUserDataSource.find({
        where: {
          id: {
            [Op.in]: userIDs,
          },
        },
        attributes: ['id', 'secureId'],
        raw: true,
      });

      let bondUsersMap = {};

      bondUsersIDs.forEach(item => {
        bondUsersMap = {
          ...bondUsersMap,
          [item.id]: item.secureId,
        };
      });

      const bulkUpdateParams = validData.map(item => {
        return {
          ...item,
          email: '',
          password: '',
          contactNumber: '',
          secureId: bondUsersMap[item.id],
        };
      });

      res = await bondUserDataSource.bulkUpdate(bulkUpdateParams, {}, [
        'firstName',
        'lastName',
      ]);
    }

    response = {
      body: {
        data: res,
        status: 'success',
      },
      statusCode: 200,
    };
    // REMOVE AFTER SYNCING USER FIRST & LAST NAMES

    // sync bond-users
    // const paginate = (query, { page, pageSize }) => {
    //   const offset = (page - 1) * pageSize;
    //   const limit = pageSize;

    //   return {
    //     ...query,
    //     offset,
    //     limit,
    //   };
    // };

    // // GET first 500 users without countryCode
    // const bondUsers = await bondUserDataSource.findAndCountAll(
    //   paginate(
    //     {
    //       where: {
    //         countryCode: null,
    //         deletedAt: null,
    //         verifiedAt: {
    //           [Op.ne]: null,
    //         },
    //       },
    //       order: [['createdAt', 'ASC']],
    //       attributes: ['id', 'contactNumber'],
    //     },
    //     { page: 1, pageSize: 500 },
    //   ),
    // );

    // if (bondUsers.rows) {
    //   // create user map
    //   const dataToUpdate = bondUsers.rows.map(bondUser => {
    //     const phone = parsePhoneNumber(`+${bondUser.contactNumber}`);
    //     const countryCode = phone?.countryCallingCode;
    //     const contactNumber = phone?.nationalNumber;

    //     return {
    //       id: bondUser.id,
    //       contactNumber,
    //       countryCode,
    //     };
    //   });

    //   // update users
    //   await Promise.all(
    //     dataToUpdate.map(async data => {
    //       await bondUserDataSource.update(
    //         {
    //           contactNumber: data.contactNumber,
    //           countryCode: data.countryCode,
    //         },
    //         {
    //           where: {
    //             id: data.id,
    //           },
    //         },
    //       );
    //     }),
    //   );
    // }
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
