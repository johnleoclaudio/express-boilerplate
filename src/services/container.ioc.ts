import { Container } from 'inversify';
import Types from '../types';
import { createLogger, format, transports } from 'winston';
import DataSource from '../interfaces/data-source';

import Client from '../interfaces/models/client';
import ClientOrm from '../db/client';
import ClientDataSource from './client-db';

import IEncrypter from '../interfaces/encrypter';
import TokenService from './token';
import Executable from '../interfaces/executable';

import ExchangeLoginService from './exchange-login';
import IUserLoginResponse from '../services/exchange-login/response';
import IUserLoginParams from '../services/exchange-login/params';

import SessionDbService from './session-db';
import Session from '../interfaces/models/session';
import SessionOrm from '../db/session';

import User from '../interfaces/models/user';
import UserDbService from './user-db';
import UserOrm from '../db/user';

import UserKeyPair from '../interfaces/models/user-key-pair';
import UserKeyPairDbService from './user-key-pair-db';
import UserKeyPairOrm from '../db/user-key-pair';

import BondUser from '../interfaces/models/bond-user';
import BondUserOrm from '../db/bond-user';
import BondUserDataSource from './bond-user-db';

import AdditionalInfo from '../interfaces/models/additional-info';
import AdditionalInfoDataSource from './additional-info-db';
import AdditionalInfoOrm from '../db/additional-info';

import OtpDbService from './otp-db';
import Otp from '../interfaces/models/otp';
import OtpOrm from '../db/otp';

import SmsService from './send-sms';
import ISmsResponse from './send-sms/response';
import ISmsParams from './send-sms/params';

import EmailService from './email-service';

import UploadToS3Service from './upload-to-s3';
import IUploadToS3Response from '../services/upload-to-s3/response';
import IUploadToS3Params from '../services/upload-to-s3/params';

import GeneratePresignedUrlService from './generate-presigned-url';
import IGeneratePresignedUrlResponse from '../services/generate-presigned-url/response';
import IGeneratePresignedUrlParams from '../services/generate-presigned-url/params';

import CheckS3BucketService from './check-s3-bucket';
import ICheckS3BucketResponse from '../services/check-s3-bucket/response';
import ICheckS3BucketParams from '../services/check-s3-bucket/params';

import VerificationCode from '../interfaces/models/verification-code';
import VerificationCodeDataSource from './verification-code-db';
import VerificationCodeOrm from '../db/verification-code';

import AdminDbService from './admin-db';
import Admin from '../interfaces/models/admin';
import AdminOrm from '../db/admin';

import AdminActionDbService from './admin-action-db';
import AdminAction from '../interfaces/models/admin-action';
import AdminActionOrm from '../db/admin-action';

import GetS3FilesListService from './get-s3-files-list';
import IGetS3FilesListServiceResponse from './get-s3-files-list/response';
import IGetS3FilesListServiceParams from './get-s3-files-list/params';

import GetBondSubsribersService from './get-bond-subscribers';

import GenerateGetPresignedUrlService from './generate-get-presigned-url';

import UploadGeneratedCSVReportService from './upload-generated-csv-report';

import LoggerService from './logger';

import LockerService from './locker';

import TransactionOtpDbService from './transaction-otp-db';
import TransactionOtp from '../interfaces/models/transaction-otp';
import TransactionOtpOrm from '../db/transaction-otp';

import InfoEditRequestDbService from './info-edit-request-db';
import InfoEditRequest from '../interfaces/models/info-edit-requests';
import InfoEditRequestOrm from '../db/info-edit-request';

import BulkEmailService from './bulk-email-service';
import IBulkEmailServiceParams from './bulk-email-service/params';
import IBulkEmailServiceResponse from './bulk-email-service/response';

import PasswordDataSource from './password-db';
import Password from '../interfaces/models/password';

import AdminManageRequestDataSource from './admin-manage-request-db';
import AdminManageRequest from '../interfaces/models/admin-manage-request';

const container = new Container();

container.bind<ClientOrm>(Types.ClientOrm).toConstructor<ClientOrm>(ClientOrm);
container.bind<DataSource<Client>>(Types.ClientDataSource).to(ClientDataSource);

container
  .bind<BondUserOrm>(Types.BondUserOrm)
  .toConstructor<BondUserOrm>(BondUserOrm);
container
  .bind<DataSource<BondUser>>(Types.BondUserDataSource)
  .to(BondUserDataSource);

container
  .bind<AdditionalInfoOrm>(Types.AdditionalInfoOrm)
  .toConstructor<AdditionalInfoOrm>(AdditionalInfoOrm);
container
  .bind<DataSource<AdditionalInfo>>(Types.AdditionalInfoDataSource)
  .to(AdditionalInfoDataSource);

container
  .bind<VerificationCodeOrm>(Types.VerificationCodeOrm)
  .toConstructor<VerificationCodeOrm>(VerificationCodeOrm);
container
  .bind<DataSource<VerificationCode>>(Types.VerificationCodeDataSource)
  .to(VerificationCodeDataSource);

container
  .bind<IEncrypter>(Types.Encrypter)
  .to(TokenService)
  .inSingletonScope();
container
  .bind<Executable<IUserLoginParams, IUserLoginResponse>>(
    Types.ExchangeLoginService,
  )
  .to(ExchangeLoginService);
container
  .bind<SessionOrm>(Types.SessionOrm)
  .toConstructor<SessionOrm>(SessionOrm);
container
  .bind<DataSource<Session>>(Types.SessionDataSource)
  .to(SessionDbService);

container
  .bind<Executable<ISmsParams, ISmsResponse>>(Types.SmsService)
  .to(SmsService);

container
  .bind<Executable<IUploadToS3Params, IUploadToS3Response>>(
    Types.UploadToS3Service,
  )
  .to(UploadToS3Service);

container
  .bind<Executable<IGeneratePresignedUrlParams, IGeneratePresignedUrlResponse>>(
    Types.GeneratePresignedUrlService,
  )
  .to(GeneratePresignedUrlService);

container
  .bind<Executable<ICheckS3BucketParams, ICheckS3BucketResponse>>(
    Types.CheckS3BucketService,
  )
  .to(CheckS3BucketService);

container.bind<OtpOrm>(Types.OtpOrm).toConstructor<OtpOrm>(OtpOrm);
container.bind<DataSource<Otp>>(Types.OtpDataSource).to(OtpDbService);

container
  .bind<TransactionOtpOrm>(Types.TransactionOtpOrm)
  .toConstructor<TransactionOtpOrm>(TransactionOtpOrm);
container
  .bind<DataSource<TransactionOtp>>(Types.TransactionOtpDataSource)
  .to(TransactionOtpDbService);

container.bind<UserOrm>(Types.UserOrm).toConstructor<UserOrm>(UserOrm);
container.bind<DataSource<User>>(Types.UserDataSource).to(UserDbService);

container
  .bind<UserKeyPairOrm>(Types.UserKeyPairOrm)
  .toConstructor<UserKeyPairOrm>(UserKeyPairOrm);
container
  .bind<DataSource<UserKeyPair>>(Types.UserKeyPairDataSource)
  .to(UserKeyPairDbService);

container.bind(Types.Logger).toConstantValue(
  createLogger({
    format: format.combine(
      format.colorize(),
      format.timestamp({
        format: 'YYYY-MM-DD HH:mm:ss',
      }),
      format.printf(params => {
        const {
          layer: layerType,
          name: layerName,
          type: requestType,
          message,
          timestamp,
        } = params;
        const layer = !layerType ? '' : `[${layerType.toUpperCase()}]`;
        const name = `[${layerName}]`;
        const type = !requestType ? '' : `[${requestType.toUpperCase()}]`;
        const log = `${timestamp}: ${type} ${layer} - ${name} ${JSON.stringify(
          message,
        )}`;
        return log;
      }),
    ),
    transports: [new transports.Console()],
  }),
);

container.bind<Executable<any, any>>(Types.LoggerService).to(LoggerService);
container.bind<Executable<any, any>>(Types.EmailService).to(EmailService);

container.bind<AdminOrm>(Types.AdminOrm).toConstructor<AdminOrm>(AdminOrm);
container.bind<DataSource<Admin>>(Types.AdminDataSource).to(AdminDbService);

container
  .bind<AdminActionOrm>(Types.AdminActionOrm)
  .toConstructor<AdminActionOrm>(AdminActionOrm);
container
  .bind<DataSource<AdminAction>>(Types.AdminActionDataSource)
  .to(AdminActionDbService);

container
  .bind<Executable<any, any>>(Types.GenerateGetPresignedUrlService)
  .to(GenerateGetPresignedUrlService);
container
  .bind<Executable<any, any>>(Types.UploadGeneratedCSVReportService)
  .to(UploadGeneratedCSVReportService);
container
  .bind<
    Executable<IGetS3FilesListServiceParams, IGetS3FilesListServiceResponse>
  >(Types.GetS3FilesListService)
  .to(GetS3FilesListService);
container
  .bind<Executable<any, any>>(Types.GetBondSubsribersService)
  .to(GetBondSubsribersService);

container.bind<Executable<any, any>>(Types.LockerService).to(LockerService);

container
  .bind<DataSource<InfoEditRequest>>(Types.InfoEditRequestDataSource)
  .to(InfoEditRequestDbService);

container
  .bind<InfoEditRequestOrm>(Types.InfoEditRequestOrm)
  .toConstructor<InfoEditRequestOrm>(InfoEditRequestOrm);

container
  .bind<Executable<IBulkEmailServiceParams, IBulkEmailServiceResponse>>(
    Types.BulkEmailService,
  )
  .to(BulkEmailService);

container
  .bind<DataSource<Password>>(Types.PasswordDataSource)
  .to(PasswordDataSource);
container
  .bind<DataSource<AdminManageRequest>>(Types.AdminManageRequestDataSource)
  .to(AdminManageRequestDataSource);

export default container;
