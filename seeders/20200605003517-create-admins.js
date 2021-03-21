const datefns = require('date-fns');

const baseDate = new Date();

const data = [
  {
    // 1
    username: 'rosh@pdax.ph',
    password: '$2a$10$sl0p1hKspsVbGs5nzjy4vOeOTz8qRyb3XFZ95paoS4xiqUPsDdlba',
    type: 'bond',
    role: 'ops_maker', // TODO: Verify if required
    two_fa_secret: 'secret123',
    two_fa_verified: true,
    access_level: 3,
    password_updated_at: new Date(),
  },
  {
    // 2
    username: 'jam@pdax.ph',
    // username: 'john.claudio@pdax.ph',
    password: '$2a$04$mTiudaYX16qIlAlC2gmEAeVPi0BIhynGPYkzO0fhSUfrSodzjj4BW', // P@ssw0rd1!!!
    type: 'bond',
    role: 'cs_maker', // TODO: Verify if required
    two_fa_secret: 'PJOSMVRJKQUDU43OFZGGW3RSJFRWQ63TKY2WMWDOOJEV4S2JJFIA',
    two_fa_verified: true,
    access_level: 2,
    password_updated_at: new Date(),
  },
  {
    // 3
    username: 'kyle-fin@pdax.ph',
    password: '$2a$04$DsywlouXUwLXnNdPWFbSme6xr3B6s1LCJlkRHx0US4Iw5iVSOLwz6',
    type: 'bond',
    role: 'ops_checker', // TODO: Verify if required
    two_fa_secret: null,
    two_fa_verified: false,
    access_level: 2,
    password_updated_at: new Date(),
  },
  {
    // 4
    username: 'king.gutierrez@pdax.ph',
    password: '$2a$04$DsywlouXUwLXnNdPWFbSme6xr3B6s1LCJlkRHx0US4Iw5iVSOLwz6',
    type: 'bond',
    role: 'extra', // TODO: Verify if required
    two_fa_secret: 'GYVFWQR6GJ4DYOKCKZEXEXJOKJYFQPCOFQ5HOVBXPMXVMR3EJY3A',
    two_fa_verified: true,
    access_level: 2,
    block_login: true,
    password_updated_at: new Date(),
  },
  {
    // 5
    username: 'nicco@pdax.ph',
    password: '$2a$10$sl0p1hKspsVbGs5nzjy4vOeOTz8qRyb3XFZ95paoS4xiqUPsDdlba',
    type: 'bond',
    role: 'admin', // TODO: Verify if required
    two_fa_secret: 'secret123',
    two_fa_verified: true,
    access_level: 3,
    password_updated_at: new Date(),
  },
  {
    // 6
    username: 'jamaica@pdax.ph',
    // username: 'john.claudio@pdax.ph',
    password: '$2a$10$sl0p1hKspsVbGs5nzjy4vOeOTz8qRyb3XFZ95paoS4xiqUPsDdlba',
    type: 'bond',
    role: 'cs_checker', // TODO: Verify if required
    two_fa_secret: 'secret123',
    two_fa_verified: true,
    access_level: 2,
    password_updated_at: new Date(),
  },
];

module.exports = {
  up: queryInterface => queryInterface.bulkInsert('admins', data),

  down: (queryInterface, sequelize) =>
    sequelize.query('truncate admins restart identity cascade'),
};
