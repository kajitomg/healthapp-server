import mailService from "../mail";
import {authDataModel} from "../../models";
import {userService} from "../user";
import {AuthDataI} from "../../models/user/auth-data-model";
import {ApiError} from "../../exceptions/api-error";
import {MyTransactionType, TransactionOptionsType} from "../../helpers/transaction";

const t: MyTransactionType = require('../../helpers/transaction')

class authDataService {
  
  static async create(userId: number, options?: TransactionOptionsType): Promise<AuthDataI> {
    const transaction = options?.transaction
    
    const user = await userService.getOneById(userId, {transaction})
    const mailAuth = await mailService.create({transaction})
    
    await mailService.sendActivationLink(user.email, `${process.env.API_URL}/api/user/activate/${mailAuth.url}`, {transaction})
    
    const authdata = await authDataModel.create({userId, mailAuthId: mailAuth.id}, {transaction: transaction.data})
    if (!authdata) {
      await t.rollback(transaction.data)
      throw ApiError.BadRequest(`Ошибка при создании пользователя`)
    }
    return authdata
    
  }
  
  static async destroy(userId: number, options?: TransactionOptionsType): Promise<number> {
    const transaction = options?.transaction
    
    let authdata = await authDataModel.findOne({where: {userId}, transaction: transaction.data})
    
    const mailAuth = await mailService.destroy(authdata.mailAuthId, {transaction})
    authdata = await authDataModel.destroy({where: {userId}, transaction: transaction.data})
    
    if (!authdata && !mailAuth) {
      await t.rollback(transaction.data)
      throw ApiError.BadRequest(`Ошибка при удалении пользователя`)
    }
    
    return 1
    
  }
  
}

export {authDataService}