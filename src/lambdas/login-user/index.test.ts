import 'reflect-metadata';
import _ from 'lodash';
import * as lambdaModule from './index';
import Database from '../../db/index';
import crypto from 'crypto';
import configFile from 'config';
import container from '../../index';
import Types from '../../types';

import Umzug = require('umzug');

const handler = lambdaModule as any;
const { loginUser } = handler;

const PUBLIC_KEY: string = configFile.get('application.publicKey');
const PASSPHRASE: string = configFile.get('application.passphrase');

const config = {
  migrations: {
    params: [Database.getQueryInterface(), Database],
    path: 'seeders',
  },
};

const umzug = new Umzug(config);

describe('LoginUser', () => {
  beforeEach(async () => {
    await umzug.up();
    jest.resetAllMocks();
  });

  afterEach(async () => {
    await umzug.down({ to: 0 });
    jest.resetAllMocks();
  });

  const mockService = {
    execute: jest.fn(),
  };

  // container.rebind(Types.ExchangeLoginService).toConstantValue(mockService);

  const params = {
    username: 'nicco.enriquez@pdax.ph',
    password: 'pass1234',
    deviceId: '123',
  };

  const event = {
    body: JSON.stringify(params),
  };

  it('works', async () => {
    // mockService.execute.mockResolvedValue({
    //   apiKey: 'mockedApiKey',
    //   apiSecret: 'mockedApiSecret',
    // });

    const res = await loginUser(event);
    const {
      data: { refreshToken, accessToken, expiresAt, payload },
    } = JSON.parse(res.body);
    // // Encrypted Response
    // const wakanai = crypto.publicDecrypt(
    //   { key: PUBLIC_KEY, passphrase: PASSPHRASE },
    //   Buffer.from(body.data.exchangeKeys),
    // );
    // const decryptedData = JSON.parse(wakanai.toString());
    // expect(decryptedData.apiKey).toEqual(
    //   '745819c1-b2a3-474a-be10-5a88e6992722',
    // );

    // // Actual Response
    // const expectedPayload = {
    //   apiKey: '745819c1-b2a3-474a-be10-5a88e6992722',
    //   apiSecret:
    //     'q6TfY+e5UilfSNXMYocmNNRzJ9OXkZBqJuGKm7+aUGRyGUaVrLYP/sMBemn8T9Gb9BnfEZa0M01jzfag4flzyQ==',
    // };
    // expect(refreshToken).toBeTruthy();
    // expect(accessToken).toBeTruthy();
    // expect(expiresAt).toBeTruthy();
    // expect(payload.apiKey).toEqual(expectedPayload.apiKey);

    // Mocked Response
    expect(refreshToken).toBeTruthy();
    expect(accessToken).toBeTruthy();
    expect(expiresAt).toBeTruthy();
    expect(payload.apiKey).toBeTruthy();
  });

  it.skip('Wrong password', async () => {
    const localParams = {
      username: 'nicco.enriquez@pdax.ph',
      password: '1234pass',
      deviceId: '123',
    };

    const localEvent = {
      body: JSON.stringify(localParams),
    };
    const res = await loginUser(localEvent);

    const body = JSON.parse(res.body);

    expect(body.data.code).toEqual('ForbiddenError');
    expect(body.data.message).toEqual('Forbidden');
  });

  // No PIN support yet
  it.skip('Login via PIN', async () => {
    const localParams = {
      username: 'nicco.enriquez@pdax.ph',
      deviceId: '123',
      pin: '1234',
    };

    const localEvent = {
      body: JSON.stringify(localParams),
    };
    const res = await loginUser(localEvent);
    const {
      data: { refreshToken, accessToken, expiresAt, payload },
    } = JSON.parse(res.body);

    expect(refreshToken).toBeTruthy();
    expect(accessToken).toBeTruthy();
    expect(expiresAt).toBeTruthy();
    expect(payload.apiKey).toBeTruthy();
  });

  // No PIN support yet
  it.skip('Login via PIN and Password. Should fail.', async () => {
    const localParams = {
      username: 'nicco.enriquez@pdax.ph',
      deviceId: '123',
      pin: '1234',
      password: 'zawarudo',
    };

    const localEvent = {
      body: JSON.stringify(localParams),
    };
    const res = await loginUser(localEvent);

    const body = JSON.parse(res.body);
    expect(body.data.code).toEqual('ValidationError');
  });
});
