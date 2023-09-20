import { userDTO } from "../dto/user";
import { UserI } from "../../models/user-model";
import { MailAuthI } from "../../models/mail-auth-model";
import { ApiError } from "../../exceptions/api-error";
import { RoleI } from "../../models/role-model";
import { MyTransactionType, TransactionOptionsType } from "../../helpers/transaction";

const bcrypt = require('bcrypt')
const { authDataService } = require('../auth-data');
const { tokenService } = require('../token');
const { roleService } = require('../role');
const { DTOService } = require('../dto');
const { mailAuthModel } = require('../../models');
const { userModel } = require('../../models');
const t: MyTransactionType = require('../../helpers/transaction')

class userService {
	static async create(email: string, password: string, name?: string, level?: string, options?: TransactionOptionsType): Promise<{ accessToken: string, refreshToken: string, user: userDTO }> {//HEAD
		const transaction = options?.transaction

		const roleData = await roleService.getOneByLevel(level, { transaction })

		return await this.registration(email, password, name, roleData, { transaction })

	}
	static async registration(email: string, password: string, name?: string, role?: RoleI, options?: TransactionOptionsType): Promise<{ accessToken: string, refreshToken: string, user: userDTO }> {//HEAD
		const transaction = options?.transaction

		const candidate = await userModel.findOne({ where: { email }, transaction: transaction.data })
		if (candidate) {
			await t.rollback(transaction.data)
			throw ApiError.BadRequest(`Пользователь с почтовым адресом ${email} уже существует`)
		}

		const hashedPassword = await bcrypt.hash(password, 5)
		let user = await userModel.create({ email, password: hashedPassword, name }, { transaction: transaction.data })
		if (!user) {
			await t.rollback(transaction.data)
			throw ApiError.BadRequest(`Ошибка при создании пользователя`)
		}

		const userdto = await this.setRole(user.id, role ? role.level : null, { transaction })

		await authDataService.create(userdto.id, { transaction })

		const tokens = tokenService.generateToken({ ...userdto })
		await tokenService.create(userdto.id, tokens.refreshToken, { transaction })

		return {
			...tokens,
			user: userdto
		}

	}

	static async login(email: string, password: string, options?: TransactionOptionsType): Promise<{ accessToken: string, refreshToken: string, user: userDTO }> {
		const transaction = options?.transaction

		const user = await userModel.findOne({ where: { email }, transaction: transaction.data })
		if (!user) {
			await t.rollback(transaction.data)
			throw ApiError.BadRequest(`Пользователь с почтовым адресом ${email} не найден`)
		}

		const isPassEquals = await bcrypt.compare(password, user.password)
		if (!isPassEquals) {
			await t.rollback(transaction.data)
			throw ApiError.BadRequest(`Неверный пароль`)
		}
		const userdto = DTOService.user(user)

		const tokens = await tokenService.generateToken({ ...userdto })
		await tokenService.saveToken(userdto.id, tokens.refreshToken, { transaction })

		return {
			...tokens,
			user: userdto
		}
	}

	static async logout(refreshToken: string, options?: TransactionOptionsType): Promise<string> {
		const transaction = options?.transaction

		const token = await tokenService.removeToken(refreshToken, { transaction })
		const commit = await t.commit(transaction.data)
		if (t.isTransactionError(commit)) {
			throw ApiError.BadRequest(`Ошибка при создании пользователя`, commit.error)
		}

		return token
	}

	static async setRole(userId: number, roleLevel: string, options?: TransactionOptionsType): Promise<userDTO> {
		const transaction = options?.transaction

		const userData = await userModel.findOne({ where: { id: userId }, transaction: transaction.data })

		if (!userData) {
			await t.rollback(transaction.data)
			throw ApiError.BadRequest(`Пользователя с данным идентификатором не существует`)
		}

		const role = await roleService.getOneByLevel(roleLevel ? roleLevel : '400', { transaction })

		userData.roleId = role.id
		const user = await userData.save({ transaction: transaction.data })
		if (!user) {
			await t.rollback(transaction.data)
			throw ApiError.BadRequest(`Ошибка при сохранении пользователя`)
		}

		return DTOService.user(user)
	}

	static async getOneById(id: number, options?: TransactionOptionsType): Promise<UserI> {
		const transaction = options?.transaction

		const user = await userModel.findOne({ where: { id }, transaction: transaction.data })
		if (!user) {
			await t.rollback(transaction.data)
			throw ApiError.BadRequest(`Пользователя с данным идентификатором не существует`)
		}

		return user
	}

	static async getAll(options?: TransactionOptionsType): Promise<userDTO[]> {
		const transaction = options?.transaction

		const users = await userModel.findAll({ transaction: transaction.data })

		if (!users) {
			await t.rollback(transaction.data)
			throw ApiError.BadRequest(`Ошибка при поиске пользователей`)
		}

		const res = users.map(user => new userDTO(user))

		return res
	}

	static async activate(activateLink: string, options?: TransactionOptionsType): Promise<MailAuthI> {
		const transaction = options?.transaction

		const mail = await mailAuthModel.findOne({ where: { url: activateLink } })
		if (!mail) {
			await t.rollback(transaction.data)
			throw ApiError.BadRequest(`Некорректная ссылка активации`)
		}

		mail.confirmation = true
		const mailData = await mail.save({ transaction: transaction.data })

		return mailData
	}

	static async refresh(refreshToken, options?: TransactionOptionsType): Promise<{ accessToken: string, refreshToken: string, user: userDTO }> {
		const transaction = options?.transaction

		if (!refreshToken) {
			await t.rollback(transaction.data)
			throw ApiError.UnauthorizedError()
		}

		const userData = tokenService.validateRefreshToken(refreshToken)
		const tokenFromDB = await tokenService.getToken(refreshToken, { transaction })

		if (!userData || !tokenFromDB) throw ApiError.UnauthorizedError()

		const user = await userModel.findOne({ where: { id: userData.id }, transaction: transaction.data })
		if (!user) {
			await t.rollback(transaction.data)
			throw ApiError.BadRequest(`Не удалось найти пользователя`)
		}
		const userdto = DTOService.user(user)

		const tokens = tokenService.generateToken({ ...userdto })
		await tokenService.saveToken(userdto.id, tokens.refreshToken, { transaction })

		return {
			...tokens,
			user: userdto
		}
	}

}

export { userService }