import config from 'config';
import { Op } from 'sequelize';
import moment from 'moment-timezone';
import Executable from '../../interfaces/executable';

const containerPath: string = config.get('application.layerPathFromLambda');
const container = require(containerPath).default;
const Types = require(`${containerPath}/types`).default;

exports.systemGenerateBondUserRegion = async (event: any) => {
  let response;
  try {
    const bondUsersDb = container.get(Types.BondUserDataSource);
    const additionalInfoDB = container.get(Types.AdditionalInfoDataSource);

    // get userId and email from bond user db
    const bondUsers = await bondUsersDb.find({
      where: {
        deletedAt: null,
        kycApprovedAt: {
          [Op.ne]: null,
        },
        kycVerifiedAt: {
          [Op.ne]: null,
        },
      },
      attributes: ['id', 'email', 'secureId'],
      order: [['id', 'DESC']],
    });

    const bondUsersIds = bondUsers.map(item => item.id);

    // get details from additional info
    const bondUsersKyc = await additionalInfoDB.find({
      where: {
        type: 'kyc',
        ownerId: { [Op.in]: bondUsersIds },
        ownerType: 'bond_user',
      },
      attributes: ['ownerId', 'details'],
      order: [['ownerId', 'DESC']],
    });

    // create hash map for faster lookup
    let kycMap = {};

    bondUsersKyc.forEach(kyc => {
      kycMap = {
        ...kycMap,
        [kyc.ownerId]: kyc?.details?.address?.permanent || {},
      };
    });

    // create an data collection to be written in s3
    const dataToBeWritten = bondUsers.map(bondUser => {
      const country = kycMap[bondUser.id]?.country || '';
      const region = kycMap[bondUser.id]?.regionState || '';
      const city = kycMap[bondUser.id]?.city || '';

      return {
        'User ID': bondUser?.secureId,
        Email: bondUser?.email,
        Country: country,
        Region: region,
        City: city,
      };
    });

    const DIRECTORY: string = process.env.SERVICE_NAME || 'pdaxauth';
    const tzDate = moment(new Date()).tz('Asia/Manila');
    const timeStamp = tzDate.format('YYYY-MM-DD h:mm:s A');
    const yearFolderName = tzDate.format('YYYY');
    const monthFolderName = tzDate.format('MMMM');

    const uploadCSV: Executable<any, any> = container.get(
      Types.UploadGeneratedCSVReportService,
    );

    const filePath = `${DIRECTORY}/bond_user/reports/miscellaneous/${yearFolderName}/${monthFolderName}/kyc_report_by_address_${timeStamp}.csv`;

    // upload to s3
    await uploadCSV.execute({
      data: dataToBeWritten,
      filePath,
    });

    response = {
      body: {
        status: 'success',
      },
      statusCode: 200,
    };
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
