import {tokenService} from "../services/token";
import {roleService} from "../services/role";
import {ApiError} from "../exceptions/api-error";
import {MyTransactionType} from "../helpers/transaction";

const t: MyTransactionType = require('../helpers/transaction')

export default (level) => {
  return async (req, res, next) => {
    const transaction = await t.create()
    try {
      
      if (t.isTransactionError(transaction)) {
        throw ApiError.BadRequest(`Ошибка при авторизации пользователя`, transaction.error)
      }
      
      let accessToken = req.headers.authorization
      if (accessToken.split(' ')[1])
        accessToken = accessToken.split(' ')[1]
      
      if (!accessToken) throw next(ApiError.UnauthorizedError())
      
      const userData = await tokenService.validateAccessToken({data:{token:accessToken}, options:{transaction}})
      if (!userData) throw next(ApiError.UnauthorizedError())

      const roleData = await roleService.getOneById({data:{id:userData.roleId}, options:{transaction}})
      if (roleData.level > level) {
        throw await next(ApiError.BadRequest('Нет доступа'))
      }
      const commit = await t.commit(transaction.data)
      if (t.isTransactionError(commit)) {
        throw ApiError.BadRequest(`Ошибка при авторизации пользователя`, commit.error)
      }
      req.user = userData
      next()
    } catch (e) {
      if (!t.isTransactionError(transaction)) {
        await t.rollback(transaction.data)
      }
      next()
    }
  }
}
