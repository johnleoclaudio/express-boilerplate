import { Container } from 'inversify';
import Types from '../types';
import Executable from '../interfaces/executable';


import ApproveKyc from './approve-kyc';
import IApproveKycParams from './approve-kyc/params';
import IApproveKycResponse from './approve-kyc/response';

const container = new Container();

container
  .bind<Executable<IApproveKycParams, IApproveKycResponse>>(Types.ApproveKyc)
  .to(ApproveKyc);

export default container;
