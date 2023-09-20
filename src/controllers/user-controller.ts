import { ApiError } from "../exceptions/api-error";
import { MyTransactionType } from "../helpers/transaction";
import { userService } from "../services/user";
const t: MyTransactionType = require('../helpers/transaction')

class userController {
	static async registration(req, res, next) {
		try {
			const { email, password } = req.body
			const transaction = await t.create()

			if (t.isTransactionError(transaction)) {
				throw ApiError.BadRequest(`Ошибка при создании пользователя`, transaction.error)
			}

			const userData = await userService.registration(email, password, undefined, undefined, { transaction })

			res.cookie('refreshToken', userData.refreshToken, { maxAge: +process.env.JWT_REFRESH_AGE * 24 * 60 * 60 * 1000, httpOnly: true, sameSite: 'None', secure: true })

			const commit = await t.commit(transaction.data)
			if (t.isTransactionError(commit)) {
				throw ApiError.BadRequest(`Ошибка при регистрации пользователя`, commit.error)
			}

			return res.json(userData)
		} catch (e) {
			next(e)
		}
	}
	static async create(req, res, next) {
		try {
			const { email, password, name, role } = req.body
			const transaction = await t.create()

			if (t.isTransactionError(transaction)) {
				throw ApiError.BadRequest(`Ошибка при создании пользователя`, transaction.error)
			}

			const userData = await userService.create(email, password, name, role, { transaction })

			const commit = await t.commit(transaction.data)
			if (t.isTransactionError(commit)) {
				throw ApiError.BadRequest(`Ошибка при создании пользователя`, commit.error)
			}

			return res.json(userData)
		} catch (e) {
			next(e)
		}
	}
	static async login(req, res, next) {
		try {
			const { email, password } = req.body
			const transaction = await t.create()

			if (t.isTransactionError(transaction)) {
				throw ApiError.BadRequest(`Ошибка при авторизации пользователя`, transaction.error)
			}

			const userData = await userService.login(email, password, { transaction })

			res.cookie('refreshToken', userData.refreshToken, { maxAge: +process.env.JWT_REFRESH_AGE * 24 * 60 * 60 * 1000, httpOnly: true, sameSite: 'None', secure: true })

			const commit = await t.commit(transaction.data)
			if (t.isTransactionError(commit)) {
				throw ApiError.BadRequest(`Ошибка при авторизации пользователя`, commit.error)
			}

			return res.json(userData)
		} catch (e) {
			next(e)
		}
	}
	static async logout(req, res, next) {
		try {
			const { refreshToken } = req.cookies
			const transaction = await t.create()

			if (t.isTransactionError(transaction)) {
				throw ApiError.BadRequest(`Ошибка при выходе из аккаунта`, transaction.error)
			}

			const token = await userService.logout(refreshToken, { transaction })

			res.clearCookie('refreshToken')

			const commit = await t.commit(transaction.data)
			if (t.isTransactionError(commit)) {
				throw ApiError.BadRequest(`Ошибка при выходе из аккаунта`, commit.error)
			}

			return res.json(token)
		} catch (e) {
			next(e)
		}
	}
	static async activate(req, res, next) {
		try {
			const activateLink = req.params.link
			const transaction = await t.create()

			if (t.isTransactionError(transaction)) {
				throw ApiError.BadRequest(`Ошибка при активации аккаунта`, transaction.error)
			}
			await userService.activate(activateLink, { transaction })

			const commit = await t.commit(transaction.data)
			if (t.isTransactionError(commit)) {
				throw ApiError.BadRequest(`Ошибка при активации аккаунта`, commit.error)
			}

			return res.redirect(process.env.CLIENT_URL)
		} catch (e) {
			next(e)
		}
	}
	static async refresh(req, res, next) {
		try {
			const { refreshToken } = req.cookies
			const transaction = await t.create()

			if (t.isTransactionError(transaction)) {
				throw ApiError.BadRequest(`Ошибка при восстановлении доступа к аккаунту`, transaction.error)
			}
			const userData = await userService.refresh(refreshToken, { transaction })

			res.cookie('refreshToken', userData.refreshToken, { maxAge: +process.env.JWT_REFRESH_AGE * 24 * 60 * 60 * 1000, httpOnly: true, sameSite: 'None', secure: true })

			const commit = await t.commit(transaction.data)
			if (t.isTransactionError(commit)) {
				throw ApiError.BadRequest(`Ошибка при восстановлении доступа к аккаунту`, commit.error)
			}

			return res.json(userData)
		} catch (e) {
			next(e)
		}
	}
	static async users(req, res, next) {
		try {
			const transaction = await t.create()

			if (t.isTransactionError(transaction)) {
				throw ApiError.BadRequest(`Ошибка при запросе пользователей`, transaction.error)
			}

			const usersData = await userService.getAll({ transaction })

			const commit = await t.commit(transaction.data)
			if (t.isTransactionError(commit)) {
				throw ApiError.BadRequest(`Ошибка запросе пользователей`, commit.error)
			}

			return res.json(usersData)
		} catch (e) {
			next(e)
		}
	}
}

export { userController }