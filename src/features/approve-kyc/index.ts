import { inject, injectable } from 'inversify';
import bcrypt from 'bcryptjs';
import config from 'config';

import { Op } from 'sequelize';
import Types from '../../types';

import AbstractExecutable from '../../abstract-executable';

import IParams from './params';
import IResponse from './response';
import schema from './schema';
import AdminAction from '../../interfaces/models/admin-action';

import Session from '../../interfaces/models/session';
import DataSource from '../../interfaces/data-source';
import IEmailServiceParams from '../../services/email-service/params';
import IEmailServiceResponse from '../../services/email-service/response';
import Executable from '../../interfaces/executable';
import {
  createKycSuccessfulTemplate,
  createKycRejectTemplate,
} from '../../services/email-service/templates/templates';

@injectable()
export default class ApproveKyc extends AbstractExecutable<IParams, IResponse> {
  constructor(
    @inject(Types.SessionDataSource)
    private sessionDataSource: DataSource<Session>,
    @inject(Types.AdminActionDataSource)
    private adminActionDataSource: DataSource<AdminAction>,
    // @inject(Types.BondUserDataSource)
    // private bondUserDataSource: DataSource<BondUser>,
    @inject(Types.BondUserDataSource)
    private bondUserDataSource: any,
    @inject(Types.EmailService)
    private emailService: Executable<
      IEmailServiceParams,
      IEmailServiceResponse
    >,
  ) {
    super();
    this.schema = schema;
  }

  async run(params: IParams) {
    const { action, userId, adminId, riskRating, remarks, role } = params;
    const bondUserRes = await this.bondUserDataSource.findOne({
      where: {
        secureId: userId,
        deletedAt: null,
      },
      attributes: [
        'id',
        'kycVerifiedAt',
        'kycApprovedAt',
        'retryKyc',
        'secureId',
      ],
    });

    if (!bondUserRes) {
      throw {
        code: 'NothingToUpdateError',
        message: 'Nothing to update',
      };
    }

    if (bondUserRes.kycVerifiedAt) {
      throw {
        code: 'UserAlreadyApprovedError',
        message: 'User has already been approved',
      };
    }

    if (action === 'reject' && !remarks) {
      throw {
        code: 'NoRemarksForRejectRequestError',
        message: 'Remarks are required for Reject action.',
      };
    }

    console.log('what bond user res:', bondUserRes);

    if (action === 'approve') {
      if (role === 'cs_checker' && !bondUserRes.kycApprovedAt) {
        throw {
          code: 'MakerApproveFirstError',
          message: 'User has not been approved by maker.',
        };
      }

      await this.adminActionDataSource.create({
        recordType: 'kyc',
        adminType: 'bond',
        adminId,
        details: {
          riskRating,
          remarks,
        },
        action,
        ownerId: bondUserRes.id,
        ownerType: 'bond_user',
      });

      const approverParams = {
        kycApprovedAt: new Date(),
        kycApprovedBy: adminId,
      };

      const verifierParams = {
        kycVerifiedAt: new Date(),
        kycVerifiedBy: adminId,
        riskRating: riskRating || '',
        retryKyc: false,
      };

      const updateParams: any =
        role === 'cs_maker' ? approverParams : verifierParams;

      const updateRes = await this.bondUserDataSource.update(updateParams, {
        where: {
          id: bondUserRes.id,
          deletedAt: null,
        },
      });

      // TODO: Add email notification to checker/verifier?

      if (!updateRes[0]) {
        throw {
          code: 'NothingToUpdateError',
          message: 'Nothing to update',
        };
      }
      const dataVal = updateRes[1][0].dataValues;

      if (dataVal.kycApprovedAt && dataVal.kycVerifiedAt) {
        const emailParams = {
          email: dataVal.email,
          subject: 'Account Verification Successful',
          content: createKycSuccessfulTemplate(),
          type: 'bonds',
        };
        await this.emailService.execute(emailParams);
      }

      return {
        id: dataVal.id,
        username: dataVal.email,
        secureId: dataVal.secureId,
        kycApprovedAt: dataVal.kycApprovedAt,
        kycApprovedBy: dataVal.kycApprovedBy,
        kycVerifiedAt: dataVal.kycVerifiedAt,
        kycVerifiedBy: dataVal.kycVerifiedBy,
        riskRating: dataVal.riskRating,
        retryKyc: dataVal.retryKyc,
        remarks,
      };
    }

    const updateRes = await this.bondUserDataSource.update(
      {
        retryKyc: true,
        kycApprovedAt: null,
        kycVerifiedAt: null,
      },
      {
        where: {
          id: bondUserRes.id,
          deletedAt: null,
        },
      },
    );

    if (!updateRes[0]) {
      throw {
        code: 'NothingToUpdateError',
        message: 'Nothing to update',
      };
    }
    const dataVal = updateRes[1][0].dataValues;

    const emailParams = {
      email: dataVal.email,
      subject: 'Account Verification Failed',
      content: createKycRejectTemplate(remarks), // TODO: Finalize template
      type: 'bonds',
    };

    await this.emailService.execute(emailParams);

    return {
      retryKyc: dataVal.retryKyc,
      remarks,
      secureId: bondUserRes.secureId,
    };
  }
}
