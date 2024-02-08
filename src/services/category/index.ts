import {ApiError} from "../../exceptions/api-error";
import {MyTransactionType} from "../../helpers/transaction";
import {categoryModel, imageModel} from "../../models";
import {ICategory} from "../../models/product/category-model";
import queriesNormalize from "../../helpers/queries-normalize";
import createSlice from "../../helpers/create-slice";

const t: MyTransactionType = require('../../helpers/transaction')

class categoryService {
  
  static create = createSlice<{
    item:ICategory,
    count:number
  },Pick<ICategory, 'name'>>(async ({data,queries, options}) => {
    const transaction = options?.transaction

    const result = await categoryModel.create(data, {transaction: transaction.data})
    
    const {count} = await this.count({queries, options:{transaction}})
    
    if (!result || !count) {
      await t.rollback(transaction.data)
      throw ApiError.BadRequest(`Ошибка при создании категории`)
    }
    
    return {
      item:result,
      count
    }
  })
  
  static get = createSlice<{
    item:ICategory
  },{ id?: number, name?: string }>(async ({data, options}) => {
    const transaction = options?.transaction
    
    const result = await categoryModel.findOne({where: data, transaction: transaction.data})
    
    if (!result) {
      await t.rollback(transaction.data)
      throw ApiError.BadRequest(`Ошибка при получении категории`)
    }
    
    return {
      item:result
    }
  })
  
  static gets = createSlice<{
    list: ICategory[],
    count: number
  }>(async ({queries, options}) => {
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
    
    
    const {count} = await this.count({queries, options:{transaction}})
    
    const result = {
      list:categories,
      count
    }
    if (!result) {
      await t.rollback(transaction.data)
      throw ApiError.BadRequest(`Ошибка при получении категории`)
    }
    
    return result
  })
  
  static update = createSlice<{
    item:ICategory
  },Pick<ICategory, 'id' | 'name'>>(async ({data, options}) => {
    const transaction = options?.transaction
    
    const result = await categoryModel.findOne({where: {id:data.id}, transaction: transaction.data})
    
    await result.update(data,{transaction: transaction.data})
    
    if (!result) {
      await t.rollback(transaction.data)
      throw ApiError.BadRequest(`Ошибка при обновлении категории`)
    }
    
    return {
      item: result
    }
  })
  
  static destroy = createSlice<{
    count:number
  },Pick<ICategory, 'id'>>(async ({data,queries, options}) => {
    const transaction = options?.transaction
    
    await categoryModel.destroy({where: {id: data.id}, transaction: transaction.data})
    
    const {count} = await this.count({queries, options:{transaction}})
    
    return {
      count
    }
  })
  
  static destroys = createSlice<{
    count:number
  },{items:ICategory[]}>(async ({data, queries, options}) => {
    const transaction = options?.transaction
    
    const categories = await imageModel.destroy({
      where: {id: data.items.map((category) => category.dataValues.id)},
      transaction: transaction.data
    })
    const {count} = await this.count({queries, options:{transaction}})
    
    if (!categories) {
      await t.rollback(transaction.data)
      throw ApiError.BadRequest(`Ошибка при удалении изображений`)
    }
    
    return {
      count
    }
  })
  
  static count = createSlice<{
    count: number
  }>(async ({queries, options}) => {
    const transaction = options?.transaction
    const normalizeQueries = queriesNormalize(queries)
    
    const count = await categoryModel.count({
      where: {
        ...normalizeQueries.searched
      },
      raw: true,
      transaction: transaction.data,
      order: normalizeQueries.order
    })
    
    return {
      count
    }
  })
  
}

export {categoryService}