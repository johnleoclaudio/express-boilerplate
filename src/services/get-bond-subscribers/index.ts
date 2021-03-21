import { injectable, inject } from 'inversify';
import config from 'config';
import axios from 'axios';

import AbstractExecutable from '../../abstract-executable';
import IParams from './params';
import IResponse from './response';
import schema from './schema';

import Types from '../../types';
import Executable from '../../interfaces/executable';

const BASE_URL: string = config.get('premyo.baseUrl');
const BOND_SECRET: string = config.get('premyo.bondSecret');
const GET_BOND_SUBS: string = config.get('premyo.endpoints.bondSubscribers');
const URL: string = `${BASE_URL}${GET_BOND_SUBS}`;

@injectable()
export default class GetBondSubsribers extends AbstractExecutable<
  IParams,
  IResponse
> {
  constructor() {
    super();
    this.schema = schema;
  }

  async run() {
    const headers: any = { Authorization: BOND_SECRET };

    try {
      const { data }: any = await axios({
        url: URL,
        method: 'GET',
        headers,
      });

      return data.data;
    } catch (err) {
      throw err;
    }
  }
}
