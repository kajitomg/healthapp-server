import {ApiError} from "../../exceptions/api-error";
import {MyTransactionType, TransactionOptionsType} from "../../helpers/transaction";
import {typeModel} from "../../models";
import {TypeI} from "../../models/product/type-model";

const t: MyTransactionType = require('../../helpers/transaction')

class typeService {
  
  static async create(data: { value?: string, basic?: boolean }, options?: TransactionOptionsType): Promise<TypeI> {
    const transaction = options?.transaction
    
    const result = await typeModel.create(data, {transaction: transaction.data})
    
    if (!result) {
      await t.rollback(transaction.data)
      throw ApiError.BadRequest(`Ошибка при создании типа`)
    }
    
    return result
    
  }
  
  static async get(data: { id?: number, value?: string }, options?: TransactionOptionsType): Promise<TypeI> {
    const transaction = options?.transaction
    
    const result = await typeModel.findAll({where: data, transaction: transaction.data})
    
    if (!result) {
      await t.rollback(transaction.data)
      throw ApiError.BadRequest(`Ошибка при получении типа`)
    }
    
    return result
    
  }
  
  static async update(data: { id: number, value?: string }, options?: TransactionOptionsType): Promise<TypeI> {
    const transaction = options?.transaction
    
    const result = await typeModel.update(data, {where: {id: data.id}, transaction: transaction.data})
    
    if (!result) {
      await t.rollback(transaction.data)
      throw ApiError.BadRequest(`Ошибка при обновлении типа`)
    }
    
    return result
    
  }
  
  static async destroy(data?: { id: number }, options?: TransactionOptionsType): Promise<number> {
    const transaction = options?.transaction
    
    const result = await typeModel.destroy({where: data, transaction: transaction.data})
    
    if (!result) {
      await t.rollback(transaction.data)
      throw ApiError.BadRequest(`Ошибка при обновлении типа`)
    }
    
    return 1
    
  }
  
}

export {typeService}