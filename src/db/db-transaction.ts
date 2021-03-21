import { injectable } from 'inversify'
import {
  Sequelize,
  Transaction,
  TransactionOptions,
  Transaction as SeqTransaction,
} from 'sequelize'

import IDbTransaction from '../interfaces/db-transaction'

@injectable()
export default class DbTransaction implements IDbTransaction {
  private sequelize: Sequelize

  constructor(sequelize: Sequelize) {
    this.sequelize = sequelize
  }

  public static LOCK_FOR_UPDATE = SeqTransaction.LOCK.UPDATE

  transaction(opts: any) {
    return new Promise(async (resolve: (t: Transaction) => any) => {
      const txn: Transaction = await this.sequelize.transaction(opts)
      resolve(txn)
    })
  }
}
