import {ApiError} from "../../exceptions/api-error";
import {MyTransactionType, TransactionOptionsType} from "../../helpers/transaction";
import {categoryModel, imageModel} from "../../models";
import {CategoryI} from "../../models/product/category-model";
import queriesNormalize from "../../helpers/queries-normalize";

const t: MyTransactionType = require('../../helpers/transaction')

class categoryService {
  
  static async create(data: { name?: string }, options?: TransactionOptionsType): Promise<CategoryI> {
    const transaction = options?.transaction
    
    const result = await categoryModel.create(data, {transaction: transaction.data})
    
    if (!result) {
      await t.rollback(transaction.data)
      throw ApiError.BadRequest(`Ошибка при создании категории`)
    }
    
    return result
    
  }
  
  static async get(data: { id?: number, name?: string }, options?: TransactionOptionsType): Promise<CategoryI> {
    const transaction = options?.transaction
    
    const result = await categoryModel.findOne({where: data, transaction: transaction.data})
    
    if (!result) {
      await t.rollback(transaction.data)
      throw ApiError.BadRequest(`Ошибка при получении категории`)
    }
    
    return result
  }
  
  static async gets(queries: any, options?: TransactionOptionsType): Promise<{
    categories: CategoryI[],
    count: number
  }> {
    const transaction = options?.transaction
    const normalizeQueries = queriesNormalize(queries)
    
    const categories = await categoryModel.findAll({
      where: {
        ...normalizeQueries.searched
      },
      raw: true,
      offset: normalizeQueries.offset,
      limit: normalizeQueries.limit,
      order: normalizeQueries.order,
      transaction: transaction.data
    })
    
    
    const {count} = await this.count(normalizeQueries, {transaction})
    
    const result = {
      categories,
      count
    }
    if (!result) {
      await t.rollback(transaction.data)
      throw ApiError.BadRequest(`Ошибка при получении категории`)
    }
    
    return result
  }
  
  static async update(data: { id?: number, name?: string }, options?: TransactionOptionsType): Promise<CategoryI> {
    const transaction = options?.transaction
    
    const result = await categoryModel.update(data, {where: data, transaction: transaction.data})
    
    if (!result) {
      await t.rollback(transaction.data)
      throw ApiError.BadRequest(`Ошибка при обновлении категории`)
    }
    
    return result
  }
  
  static async destroy(data?: { categoryId: number }, options?: TransactionOptionsType): Promise<number> {
    const transaction = options?.transaction
    
    await categoryModel.destroy({where: {id: data.categoryId}, transaction: transaction.data})
    
    return 1
  }
  
  static async destroys(data?: any[], options?: TransactionOptionsType): Promise<number> {
    const transaction = options?.transaction
    
    
    const categories = await imageModel.destroy({
      where: {id: data.map((category) => category.dataValues.id)},
      transaction: transaction.data
    })
    
    if (!categories) {
      await t.rollback(transaction.data)
      throw ApiError.BadRequest(`Ошибка при удалении изображений`)
    }
    
    return 1
  }
  
  static async count(queries: any, options?: TransactionOptionsType): Promise<{ count: number }> {
    const transaction = options?.transaction
    
    const count = await categoryModel.count({
      where: {
        ...queries.searched
      },
      raw: true,
      transaction: transaction.data,
      order: queries.order
    })
    
    return {
      count
    }
  }
  
}

export {categoryService}