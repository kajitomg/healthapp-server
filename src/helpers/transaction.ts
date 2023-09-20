import { Transaction } from "sequelize"
import { DBService } from "../services/db"

const sequalize = DBService.postgres.sequalize

export type TransactionOptionsType = { transaction: TransactionSuccessCreateType }
export type TransactionErrorType = { status: false, error: any }
export type TransactionSuccessCreateType = { status: true, data: Transaction }
export type TransactionSuccessCommitType = { status: true }
export type CreateType = TransactionSuccessCreateType | TransactionErrorType
export type CommitType = TransactionSuccessCommitType | TransactionErrorType
export type RollbackType = never | TransactionErrorType
export type MyTransactionType = { create: () => Promise<CreateType>, commit: (transaction: Transaction) => Promise<CommitType>, rollback: (transaction: Transaction) => Promise<RollbackType>, isTransactionError: typeof isTransactionError }
const isTransactionError = (obj: CreateType | CommitType | RollbackType): obj is TransactionErrorType => {
	return obj.status === false && obj.error
}

const create = async (): Promise<CreateType> => {
	try {
		const t = await sequalize.transaction({
			isolationLevel: Transaction.ISOLATION_LEVELS.READ_UNCOMMITTED
		})
		return Promise.resolve({
			status: true,
			data: t
		})
	} catch (error) {
		return Promise.reject({
			status: false,
			error
		})
	}
}

const commit = async (transaction): Promise<CommitType> => {
	try {
		await transaction.commit()
		return Promise.resolve({
			status: true
		})
	} catch (error) {
		await rollback(transaction)
		return Promise.reject({
			status: false,
			error
		})
	}
}

const rollback = async (transaction): Promise<RollbackType> => {
	try {
		await transaction.rollback()
	} catch (error) {
		return Promise.reject({
			status: false,
			error
		})
	}
}

module.exports = {
	create,
	commit,
	rollback,
	isTransactionError
}