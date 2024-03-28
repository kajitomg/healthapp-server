import {ApiError} from "../../exceptions/api-error";
import {valueModel} from "../../models";
import {IValue} from "../../models/product/value-model";
import queriesNormalize from "../../helpers/queries-normalize";
import createSlice from "../../helpers/create-slice";


class valueService {
  
  static create = createSlice<{
    item:IValue,
    count:number
  },Pick<IValue, 'value' | 'basic'>>(async ({data,queries, options}) => {
    const transaction = options?.transaction
    
    const result = await valueModel.create(data, {transaction: transaction.data})
    const {count} = await this.count({queries, options:{transaction}})
    
    if (!result || !count) {
      throw ApiError.BadRequest(`Ошибка при создании значения`)
    }
    return {
      item:result,
      count
    }
    
  })
  
  static get = createSlice<{
    item:IValue
  },Pick<IValue, 'id' | 'value'>>(async ({data, options}) => {
    const transaction = options?.transaction
    
    const result = await valueModel.findOne({where: data, transaction: transaction.data})
    
    if (!result) {
      throw ApiError.BadRequest(`Ошибка при получении значения`)
    }
    
    return {
      item:result
    }
    
  })
  
  static gets = createSlice<{
    list: IValue[],
    count: number
  }>(async ({queries, options}) => {
    const transaction = options?.transaction
    const normalizeQueries = queriesNormalize(queries)
    
    const values = await valueModel.findAll({
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
      list:values,
      count
    }
    if (!result) {
      throw ApiError.BadRequest(`Ошибка при получении знаечний`)
    }
    
    return result
  })
  
  static update = createSlice<{
    item:IValue
  },Pick<IValue, 'id' | 'value'>>(async ({data, options}) => {
    const transaction = options?.transaction
    
    const result = await valueModel.update(data, {where: {id: data.id}, transaction: transaction.data})
    
    if (!result) {
      throw ApiError.BadRequest(`Ошибка при обновлении значения`)
    }
    
    return {
      item:result
    }
    
  })
  
  static destroy = createSlice<{
    count:number
  },Pick<IValue, 'id'>>(async ({data,queries, options}) => {
    const transaction = options?.transaction
    
    const result = await valueModel.destroy({where: {id:data.id}, transaction: transaction.data})
    
    const {count} = await this.count({queries, options:{transaction}})
    
    if (!count) {
      throw ApiError.BadRequest(`Ошибка при удалении значения`)
    }
    
    return {count}
    
  })
  
  static destroys = createSlice<{
    count:number
  },{items:IValue[]}>(async ({data, queries, options}) => {
    const transaction = options?.transaction
    
    await valueModel.destroy({where: {id: data.items.map((value) => value.dataValues.id)}, transaction: transaction.data})
    
    const {count} = await this.count({queries, options:{transaction}})
    
    return {
      count
    }
  })
  
  static count = createSlice<{ count: number }>(async ({queries, options}) => {
    const transaction = options?.transaction
    const normalizeQueries = queriesNormalize(queries)
    
    const count = await valueModel.count({
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

export {valueService}