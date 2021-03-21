import 'reflect-metadata';
import _ from 'lodash';
import * as lambdaModule from './index';
import Database from '../../db/index';

import container from '../../index';
import Types from '../../types';

import Umzug = require('umzug');

const { updateAdditionalInfo } = lambdaModule as any;

const config = {
  migrations: {
    params: [Database.getQueryInterface(), Database],
    path: 'seeders',
  },
};

const umzug = new Umzug(config);

describe('UpdateAdditionalInfo', () => {
  beforeEach(async () => {
    await umzug.up();
    jest.resetAllMocks();
  });

  afterEach(async () => {
    await umzug.down({ to: 0 });
    jest.resetAllMocks();
  });

  const params = {
    details: {
      ele: 'giggle',
    },
  };

  const kycParams = {
    details: {
      currentPage: 1,
      personalInfo: {
        firstName: 'Stan',
        middleName: null,
        lastName: 'Quintos',
        birthday: '11/02/1991',
        sex: 'Male',
        civilStatus: 'Married',
        nationality: 'Philippines',
        governmentIdType: 'TIN',
        governmentIdIdentifier: '123456789000',
        // spouse: {
        //   firstName: 'Susan',
        //   middleName: 'Porter',
        //   lastName: 'Quintos',
        //   birthday: '11/02/1991',
        //   contactNumberRegion: '+63',
        //   contactNumber: '912-345-6789',
        //   employerName: 'Din Tai Fung',
        //   position: 'Admin Staff',
        //   workAddress: 'Two/NEO, Ground Floor, 3rd Ave, Taguig',
        // },
      },
      address: {
        present: {
          lineA: 'House No,. Street., Barangay',
          lineB: 'Unit No,. Floor, Building',
          country: 'Country',
          regionState: 'Region/Province/State',
          city: 'Taguig City',
          zip: '1416',
        },
        permanent: {
          lineA: 'House No,. Street., Barangay',
          lineB: 'Unit No,. Floor, Building',
          country: 'Country',
          regionState: 'Region/Province/State',
          city: 'Taguig City',
          zip: '1416',
        },
      },
      employmentInfo: {
        employmentType: 'Permanent Employee',
        businessName: 'Business name',
        position: 'Position',
        yearsInWork: '1',
        grossMonthlyIncome: '10',
        businessContactNumber: null,
        businessEmailAddress: null,
        businessIndustryType: 'industry type',
        businessAddress: 'business address',
      },
      uploadId: {
        type: 'primary',
        idA: 'http',
        idB: null,
        fileA: 'file64',
        fileB: null,
        selfie: 'http',
      },
      proofOfIncome: {
        file: null,
        type: null,
      },
      proofOfResidence: {
        file: null,
        type: null,
      },
    },
  };

  it.only('bond user info is successfully updated. kyc finished', async () => {
    const event = {
      body: JSON.stringify(kycParams),
      headers: {
        Authorization: 'bond_user_access_token',
      },
      pathParameters: {
        type: 'kyc',
        scope: 'bond_user',
      },
    };
    const res = await updateAdditionalInfo(event);
    const { data } = JSON.parse(res.body);

    console.log('da res:', data);

    expect(data.type).toBeTruthy();
    expect(data.details).toBeTruthy();
    expect(data.ownerId).toBeTruthy();
    expect(data.ownerType).toBeTruthy();
    expect(data.kycFinishedAt).toBeTruthy();
  });

  it('bond user info is successfully updated. kyc not finished', async () => {
    const event = {
      body: JSON.stringify(params),
      headers: {
        Authorization: 'bond_user_access_token',
      },
      pathParameters: {
        type: 'kyc',
        scope: 'bond_user',
      },
    };
    const res = await updateAdditionalInfo(event);
    const { data } = JSON.parse(res.body);

    expect(data.type).toBeTruthy();
    expect(data.details).toBeTruthy();
    expect(data.ownerId).toBeTruthy();
    expect(data.ownerType).toBeTruthy();
    expect(data.kycFinishedAt).toBeFalsy();
  });

  it('bond user accepts risk acceptance', async () => {
    const localParams = {
      details: {
        accept: true,
      },
    };
    const event = {
      body: JSON.stringify(localParams),
      headers: {
        Authorization: 'bond_user_access_token',
      },
      pathParameters: {
        type: 'riskAcceptance',
        scope: 'bond_user',
      },
    };
    const res = await updateAdditionalInfo(event);
    const { data } = JSON.parse(res.body);

    console.log('da data:', data);

    expect(data.type).toBeTruthy();
    expect(data.details).toBeTruthy();
  });
});
