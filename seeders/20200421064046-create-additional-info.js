const data = [
  {
    owner_type: 'bond_user',
    owner_id: 1,
    type: 'csa',
    details: JSON.stringify({
      annualHouseholdIncome: 'Less than PHP 5M',
      sourceOfFunds: 'Salary',
      investmentAmount: '123',
      investmentCurrency: 'PHP',
      assetInvestmentPercentage: 'Less than 25%',
      investmentObjectives: 'Estate/Wealth Planning',
      riskToleranceA: true,
      riskToleranceB: true,
      riskToleranceC: false,
      investmentExperience: 'Slightly Experienced',
      currentPreviousInvestments: [
        'Bank Deposit Products',
        'Government Securities',
        'Bank Deposit Products',
      ],
      investmentTerm: 'Long-Term: Over 5 years',
      liquidityImportance: 'Moderately Important',
    }),
  },
  {
    owner_type: 'bond_user',
    owner_id: 8,
    type: 'kyc',
    details: JSON.stringify({
      personalInfo: {
        firstName: 'Stan',
        middleName: 'Bravo',
        lastName: 'Quintos',
        birthday: '11/02/1991', // what format?
        sex: 'Male',
        civilStatus: 'Married',
        nationality: 'Philippines',
        governmentIdType: 'TIN',
        governmentIdIdentifier: '123456789000',
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
        businessName: '',
        position: '',
        yearsInWork: '',
        grossMonthlyIncome: '',
        businessContactNumber: '',
        businessEmailAddress: '',
        businessIndustryType: '',
        businessAddress: '',
      },
      uploadId: {
        type: 'primary',
        idA: 'license',
        idB: '',
        fileA: 'base64here',
        fileB: null,
        selfie:
          'https://anxone-dev-ap-southeast-1.s3.ap-southeast-1.amazonaws.com/pdaxauth/bond_user/kyc/7b5cf952-40f8-4d5e-ad9e-c06f121bf151/selfie/selfie',
      },
      proofOfIncome: {
        type: 'utility',
        file: 'http',
      },
      proofOfResidence: {
        type: 'utility',
        file: 'http',
      },
    }),
  },
  {
    owner_type: 'bond_user',
    owner_id: 1,
    type: 'riskAcceptance',
    details: JSON.stringify({
      result: true,
    }),
  },
];

module.exports = {
  up: queryInterface => queryInterface.bulkInsert('additional_infos', data),

  down: (queryInterface, sequelize) =>
    sequelize.query('truncate additional_infos restart identity cascade'),
};
