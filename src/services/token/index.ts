import { Transaction } from "sequelize";
import { ApiError } from "../../exceptions/api-error";
import { MyTransactionType, TransactionOptionsType } from "../../helpers/transaction";
import { TokenI } from "../../models/token-model";
import { userDTO } from "../dto/user";

require('dotenv').config()
const jwt = require('jsonwebtoken')
const { tokenModel } = require('../../models');
const t: MyTransactionType = require('../../helpers/transaction')

class tokenService {
	static async create(userId: number, refreshToken: string, options?: TransactionOptionsType): Promise<TokenI> {
		const transaction = options?.transaction

		const token = await tokenModel.create({ userId, refresh: refreshToken }, { transaction: transaction.data })
		if (!token) {
			await t.rollback(transaction.data)
			throw ApiError.BadRequest(`Ошибка при создании пользователя`)
		}
		return token

	}

	static generateToken(payload: any): { accessToken: string, refreshToken: string } {
		const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_KEY, { expiresIn: `${process.env.JWT_ACCESS_AGE}m` })
		const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_KEY, { expiresIn: `${process.env.JWT_REFRESH_AGE}d` })

		return {
			accessToken,
			refreshToken
		}
	}

	static validateAccessToken(token: string): userDTO | null {
		try {
			const userData = jwt.verify(token, process.env.JWT_ACCESS_KEY)
			return userData
		}
		catch (e) {
			return null
		}
	}

	static validateRefreshToken(token: string): userDTO | null {
		try {
			const userData = jwt.verify(token, process.env.JWT_REFRESH_KEY)
			return userData
		}
		catch (e) {
			return null
		}
	}

	static async saveToken(userId: number, refreshToken: string, options?: TransactionOptionsType): Promise<TokenI> {
		const transaction = options?.transaction

		const tokenData = await tokenModel.findOne({ where: { userId }, transaction: transaction.data })

		if (tokenData) {
			tokenData.refresh = refreshToken
			const token = await tokenData.save({ transaction: transaction.data })
			if (!token) {
				await t.rollback(transaction.data)
				throw ApiError.BadRequest(`Ошибка при сохранении токена`)
			}
			return token
		}
		return await this.create(userId, refreshToken, { transaction: options.transaction })

	}

	static async removeToken(refreshToken: string, options?: TransactionOptionsType): Promise<string> {
		const transaction = options?.transaction

		const token = await tokenModel.destroy({ where: { refresh: refreshToken }, transaction: transaction.data })
		if (!token) {
			await t.rollback(transaction.data)
			throw ApiError.BadRequest(`Ошибка при удалении токена`)
		}
		return token
	}
	static async getToken(refreshToken: string, options?: TransactionOptionsType): Promise<string> {
		const transaction = options?.transaction

		const token = await tokenModel.findOne({ where: { refresh: refreshToken }, transaction: transaction.data })

		if (!token) {
			await t.rollback(transaction.data)
			throw ApiError.BadRequest(`Ошибка при поиске токена`)
		}
		return token
	}
}

export { tokenService }
