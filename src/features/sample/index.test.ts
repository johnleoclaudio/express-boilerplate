import 'reflect-metadata';
import container from '../../index';
import Types from '../../types';
import Database from '../../db';

import Umzug = require('umzug');

const config = {
  migrations: {
    params: [Database.getQueryInterface(), Database],
    path: 'seeders',
  },
};

const umzug = new Umzug(config);

describe('SampleFeature', () => {
  beforeEach(async () => {
    await umzug.up();
  });

  afterEach(async () => {
    await umzug.down({ to: 0 });
  });

  it("adjusts a redeemed bond's price", async () => {
    const sample: any = container.get(Types.SampleFeature);

    const params = {
      sampleId: 1,
    };

    const res = await sample.execute(params);

    expect(res).toEqual(1);
  });
});
