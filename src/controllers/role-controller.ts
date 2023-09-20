import { ApiError } from "../exceptions/api-error";
import { MyTransactionType } from "../helpers/transaction";
import { roleService } from "../services/role";
const t: MyTransactionType = require('../helpers/transaction')


class roleController {

	static async create(req, res, next) {
		try {
			const { name, level } = req.body
			const transaction = await t.create()

			if (t.isTransactionError(transaction)) {
				throw ApiError.BadRequest(`Ошибка при создании роли`, transaction.error)
			}

			await roleService.create(level, name, { transaction })

			const commit = await t.commit(transaction.data)
			if (t.isTransactionError(commit)) {
				throw ApiError.BadRequest(`Ошибка при регистрации роли`, commit.error)
			}

			return res.status(200).json({ text: 'Роль успешно создана' })
		} catch (e) {
			next(e)
		}
	}

	static async roles(req, res, next) {
		try {
			const transaction = await t.create()

			if (t.isTransactionError(transaction)) {
				throw ApiError.BadRequest(`Ошибка при запросе ролей`, transaction.error)
			}

			const roles = await roleService.getAll({ transaction })

			const commit = await t.commit(transaction.data)
			if (t.isTransactionError(commit)) {
				throw ApiError.BadRequest(`Ошибка при запросе ролей`, commit.error)
			}

			return res.status(200).json(roles)
		} catch (e) {
			next(e)
		}
	}
}

export { roleController }