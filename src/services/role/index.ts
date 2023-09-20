import { roleModel } from "../../models";
import { RoleI } from "../../models/role-model";
import { ApiError } from "../../exceptions/api-error";
import { MyTransactionType, TransactionOptionsType } from "../../helpers/transaction";

const t: MyTransactionType = require('../../helpers/transaction')

class roleService {
	static async create(level: string, name: string, options?: TransactionOptionsType): Promise<RoleI> {
		const transaction = options?.transaction || await t.create()

		if (t.isTransactionError(transaction)) {
			throw ApiError.BadRequest(`Ошибка при авторизации пользователя`, transaction.error)
		}
		const roleData = await roleModel.findOne({ where: { level }, transaction: transaction.data })
		if (roleData) {
			await t.rollback(transaction.data)
			throw ApiError.BadRequest(`Роль с уровнем доступа ${level} уже существует`)
		}
		const role = await roleModel.create({ name, level }, { transaction: transaction.data })
		if (!role) {
			await t.rollback(transaction.data)
			throw ApiError.BadRequest(`Ошибка при создании пользователя`)
		}
		return role
	}

	static async getOneById(id: number, options?: TransactionOptionsType): Promise<RoleI> {
		const transaction = options?.transaction || await t.create()

		if (t.isTransactionError(transaction)) {
			throw ApiError.BadRequest(`Ошибка при авторизации пользователя`, transaction.error)
		}
		const roleData = await roleModel.findOne({ where: { id } })
		if (!roleData) {
			await t.rollback(transaction.data)
			throw ApiError.BadRequest(`Роли не существует`)
		}

		return roleData
	}
	static async getOneByLevel(level: string, options?: TransactionOptionsType): Promise<RoleI> {
		const transaction = options?.transaction || await t.create()

		if (t.isTransactionError(transaction)) {
			throw ApiError.BadRequest(`Ошибка при авторизации пользователя`, transaction.error)
		}
		const roleData = await roleModel.findOne({ where: { level }, transaction: transaction.data })
		if (!roleData) {
			await t.rollback(transaction.data)
			throw ApiError.BadRequest(`Роли не существует`)
		}

		return roleData
	}
	static async getAll(options?: TransactionOptionsType): Promise<RoleI> {
		const transaction = options?.transaction || await t.create()

		if (t.isTransactionError(transaction)) {
			throw ApiError.BadRequest(`Ошибка при авторизации пользователя`, transaction.error)
		}
		const roleData = await roleModel.findAll()
		if (!roleData) {
			await t.rollback(transaction.data)
			throw ApiError.BadRequest(`Роли не существует`)
		}

		return roleData
	}
}

export { roleService }