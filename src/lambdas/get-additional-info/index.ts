import config from 'config';

const containerPath: string = config.get('application.layerPathFromLambda');
const container = require(containerPath).default;
const Types = require(`${containerPath}/types`).default;
const encryptResponse = require(`${containerPath}/utils/encrypt`).default;

const DIRECTORY: string = process.env.SERVICE_NAME || 'pdaxauth';

exports.getAdditionalInfo = async (event: any) => {
  let response;
  try {
    const { Authorization: access_token } = event.headers;
    const { type, scope } = event.pathParameters;

    const tokenChecker = container.get(Types.CheckToken);

    await tokenChecker.execute({
      accessToken: access_token,
      scope,
      // scope: 'bond_user',
    });

    const sessionDataSource = container.get(Types.SessionDataSource);
    const additionalInfoDataSource = container.get(
      Types.AdditionalInfoDataSource,
    );

    const { ownerId, ownerType } = await sessionDataSource.findOne({
      where: {
        accessToken: access_token,
      },
    });

    let result;

    const data = await additionalInfoDataSource.findOne({
      where: {
        ownerId,
        type,
        ownerType,
      },
    });

    if (data && type === 'kyc') {
      let idResult;

      const generateGetPresignedUrlService = container.get(
        Types.GenerateGetPresignedUrlService,
      );
      const uploadedId = data?.details?.uploadId;

      if (uploadedId) {
        // get the URLs
        const { fileA, fileB, selfie } = uploadedId;
        const idsUrl = [
          { fieldName: 'fileA', value: fileA },
          { fieldName: 'fileB', value: fileB },
          { fieldName: 'selfie', value: selfie },
        ];

        // remove https string
        const dataForSignedUrl = idsUrl
          .filter(item => item.value !== null)
          .map(item => {
            const splitValue = item.value.split('/');
            // TODO: Remove this workaround
            if (splitValue[0] !== 'https:') {
              return {
                fieldName: item.fieldName,
                value: item.value,
                type: 'base64',
              };
            }
            const indexWhereToStart = splitValue.indexOf(DIRECTORY);
            const value = splitValue.slice(indexWhereToStart).join('/');
            return {
              fieldName: item.fieldName,
              value,
              type: 'url',
            };
          });

        // get "GET" signed url
        const getSignedUrls = await Promise.all(
          dataForSignedUrl.map(async item => {
            if (item.type !== 'url') {
              return {
                fieldName: item.fieldName,
                value: item.value,
              };
            }

            const signedUrl = await generateGetPresignedUrlService.execute({
              key: item.value,
            });

            return {
              fieldName: item.fieldName,
              value: signedUrl,
            };
          }),
        );

        // transform back to original shape
        const idsOriginalShape = getSignedUrls.map(item => {
          return {
            [item.fieldName]: item.value,
          };
        });

        let idsOriginalShapeObj = {};

        idsOriginalShape.forEach(item => {
          idsOriginalShapeObj = {
            ...idsOriginalShapeObj,
            ...item,
          };
        });

        idResult = { ...uploadedId, ...idsOriginalShapeObj };
      }

      result = {
        type: data.type,
        details: {
          ...data.details,
          uploadId: idResult,
        },
        ownerId: data.ownerId,
      };
    } else {
      result = data;
    }

    response = {
      body: {
        data: result,
        status: 'success',
      },
      statusCode: 200,
    };
  } catch (err) {
    console.log('daerr', err);
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
