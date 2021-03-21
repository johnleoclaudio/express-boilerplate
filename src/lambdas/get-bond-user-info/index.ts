import config from 'config';

const containerPath: string = config.get('application.layerPathFromLambda');
const container = require(containerPath).default;
const Types = require(`${containerPath}/types`).default;
const encryptResponse = require(`${containerPath}/utils/encrypt`).default;

exports.getBondUserInfo = async (event: any) => {
  let response;
  try {
    const { Authorization: access_token } = event.headers;

    const tokenChecker = container.get(Types.CheckToken);

    await tokenChecker.execute({
      accessToken: access_token,
      scope: 'bond_user',
    });

    const bondUserDataSource = container.get(Types.BondUserDataSource);
    const sessionDataSource = container.get(Types.SessionDataSource);
    const additionalInfoDataSource = container.get(
      Types.AdditionalInfoDataSource,
    );

    const { ownerId } = await sessionDataSource.findOne({
      where: {
        accessToken: access_token,
        ownerType: 'bond_user',
      },
    });

    const bondUserData = await bondUserDataSource.findOne({
      where: {
        id: ownerId,
        deletedAt: null,
      },
    });

    // TODO: Get additional info. birthday maybe.

    let birthday = null;
    const addlInfo = await additionalInfoDataSource.findOne({
      where: {
        ownerId,
        type: 'kyc',
        ownerType: 'bond_user',
      },
    });

    try {
      birthday = addlInfo.details.personalInfo.birthday;
    } catch (err) {
      // do nothing
    }

    // TODO: FIX Later - Workaround - Get Premyo Terms and Agreement

    let premyoTermsAndConditionsFinished = false;
    const addlInfoPremyoTerms =
      (await additionalInfoDataSource.findOne({
        where: {
          ownerId,
          type: 'investorDocuments',
          ownerType: 'bond_user',
        },
        attributes: ['id', 'details'],
      })) || null;

    if (
      addlInfoPremyoTerms &&
      addlInfoPremyoTerms.details &&
      addlInfoPremyoTerms.details.termsAndConditionsNew &&
      addlInfoPremyoTerms.details.riskDisclosure
    ) {
      premyoTermsAndConditionsFinished = true;
    }

    const data = bondUserData.dataValues;
    data.birthday = birthday;
    data.username = data.email;
    data.premyoTermsAndConditionsFinished = premyoTermsAndConditionsFinished;
    delete data.email;
    delete data.password;

    response = {
      body: {
        data,
        status: 'success',
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
