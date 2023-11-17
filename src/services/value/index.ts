import {ApiError} from "../../exceptions/api-error";
import {MyTransactionType, TransactionOptionsType} from "../../helpers/transaction";
import {valueModel} from "../../models";
import {ValueI} from "../../models/product/value-model";

const t: MyTransactionType = require('../../helpers/transaction')

class valueService {
  
  static async create(data: { value?: string, basic?: boolean }, options?: TransactionOptionsType): Promise<ValueI> {
    const transaction = options?.transaction
    
    const result = await valueModel.create(data, {transaction: transaction.data})
    
    if (!result) {
      await t.rollback(transaction.data)
      throw ApiError.BadRequest(`Ошибка при создании значения`)
    }
    
    return result
    
  }
  
  static async get(data: { id?: number, value?: string }, options?: TransactionOptionsType): Promise<ValueI[]> {
    const transaction = options?.transaction
    
    const result = await valueModel.findAll({where: data, transaction: transaction.data})
    
    if (!result) {
      await t.rollback(transaction.data)
      throw ApiError.BadRequest(`Ошибка при получении значения`)
    }
    
    return result
    
  }
  
  static async update(data: { id: number, value?: string }, options?: TransactionOptionsType): Promise<ValueI> {
    const transaction = options?.transaction
    
    const result = await valueModel.update(data, {where: {id: data.id}, transaction: transaction.data})
    
    if (!result) {
      await t.rollback(transaction.data)
      throw ApiError.BadRequest(`Ошибка при обновлении значения`)
    }
    
    return result
    
  }
  
  static async destroy(data?: { id: number }, options?: TransactionOptionsType): Promise<number> {
    const transaction = options?.transaction
    
    const result = await valueModel.destroy({where: data, transaction: transaction.data})
    
    if (!result) {
      await t.rollback(transaction.data)
      throw ApiError.BadRequest(`Ошибка при обновлении значения`)
    }
    
    return 1
    
  }
  
  static async destroys(data?: any[], options?: TransactionOptionsType): Promise<number> {
    const transaction = options?.transaction
    
    await valueModel.destroy({where: {id: data.map((value) => value.dataValues.id)}, transaction: transaction.data})
    
    return 1
  }
  
}

export {valueService}