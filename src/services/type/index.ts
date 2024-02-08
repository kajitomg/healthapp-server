import {ApiError} from "../../exceptions/api-error";
import {MyTransactionType} from "../../helpers/transaction";
import {typeModel} from "../../models";
import {IType} from "../../models/product/type-model";
import queriesNormalize from "../../helpers/queries-normalize";
import createSlice from "../../helpers/create-slice";

const t: MyTransactionType = require('../../helpers/transaction')

class typeService {
  
  static create = createSlice<{
    item:IType,
    count:number
  },Pick<IType, 'value' | 'basic'>>(async ({data,queries, options}) => {
    const transaction = options?.transaction
    
    const result = await typeModel.create(data, {transaction: transaction.data})
    
    const {count} = await this.count({queries, options:{transaction}})
    
    if (!result || !count) {
      await t.rollback(transaction.data)
      throw ApiError.BadRequest(`Ошибка при создании типа`)
    }
    
    return {
      item:result,
      count
    }
    
  })
  
  static get = createSlice<{
    item:IType
  },Pick<IType, 'id' | 'value'>>(async ({data, options}) => {
    const transaction = options?.transaction
    
    const result = await typeModel.findAll({where: data, transaction: transaction.data})
    
    if (!result) {
      await t.rollback(transaction.data)
      throw ApiError.BadRequest(`Ошибка при получении типа`)
    }
    
    return {
      item:result
    }
    
  })
  
  static gets = createSlice<{
    list: IType[],
    count: number
  }>(async ({queries, options}) => {
    const transaction = options?.transaction
    const normalizeQueries = queriesNormalize(queries)
    
    const types = await typeModel.findAll({
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
      list:types,
      count
    }
    if (!result) {
      await t.rollback(transaction.data)
      throw ApiError.BadRequest(`Ошибка при получении категории`)
    }
    
    return result
  })
  
  static update = createSlice<{
    item:IType
  },Pick<IType, 'id' | 'value'>>(async ({data, options}) => {
    const transaction = options?.transaction
    
    const result = await typeModel.findOne({where: {id: data.id}, transaction: transaction.data})
    
    await result.update(data,{transaction:transaction.data})
    
    if (!result) {
      await t.rollback(transaction.data)
      throw ApiError.BadRequest(`Ошибка при обновлении типа`)
    }
    
    return {
      item:result
    }
    
  })
  
  static destroy = createSlice<{
    count:number
  },Pick<IType, 'id'>>(async ({data,queries, options}) => {
    const transaction = options?.transaction
    
    const result = await typeModel.destroy({where: {id:data.id}, transaction: transaction.data})
    
    const {count} = await this.count({queries, options:{transaction}})
    
    if (!result || !count) {
      await t.rollback(transaction.data)
      throw ApiError.BadRequest(`Ошибка при обновлении типа`)
    }
    
    return {
      count
    }
    
  })
  
  static count = createSlice<{ count: number }>(async ({queries, options}) => {
    const transaction = options?.transaction
    const normalizeQueries = queriesNormalize(queries)
    
    const count = await typeModel.count({
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

export {typeService}