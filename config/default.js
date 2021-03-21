module.exports = {
  application: {
    layerPathFromLambda: process.env.CONTAINER_PATH,
    salt: 1,
    privateKey: process.env.PRIVATE_KEY,
    publicKey: process.env.PUBLIC_KEY,
    passphrase: process.env.PASSPHRASE,
  },
  database: {
    username: process.env.DATABASE_USER,
    port: process.env.DATABASE_PORT,
    database: process.env.DATABASE_NAME,
    password: process.env.DATABASE_PASSWORD,
    host: process.env.DATABASE_HOST,
    dialect: 'postgres',
    pool: {
      max: 5,
      min: 0,
      acquire: 120000,
      idle: 10000,
    },
  },
  anxone: {
    baseUrl: process.env.ANXONE_BASE_URL,
    endpoints: {
      login: '/apiKey',
    },
    apiId: process.env.ANXONE_API_ID,
    secretKey: process.env.ANXONE_SECRET_KEY,
  },
  exchange: {
    baseUrl: process.env.EXCHANGE_BASE_URL,
    endpoints: {
      login: '/api_key',
    },
  },
};
