import { Container } from 'inversify';
import Types from '../types';
import Executable from '../interfaces/executable';

import BondUserRegisterObserver from './bond-register';
import CheckOtpObserver from './check-otp';

const container = new Container();

container
  .bind<Executable<any, any>>(Types.BondUserRegisterObserver)
  .to(BondUserRegisterObserver);
container
  .bind<Executable<any, any>>(Types.CheckOtpObserver)
  .to(CheckOtpObserver);

export default container;
