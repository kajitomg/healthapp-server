import createSlice from "../../helpers/create-slice";
import {ApiError} from "../../exceptions/api-error";
import queriesNormalize from "../../helpers/queries-normalize";
import {levelModel} from "../../models";
import {ILevel} from "../../models/product/level-model";


class levelService {
  
  static create = createSlice<{
    item:ILevel,
    count:number
  },Pick<ILevel,'name'>>(async ({data,queries, options}) => {
    const transaction = options?.transaction
    
    const result = await levelModel.create(data, {transaction: transaction.data})
    
    const {count} = await this.count({queries, options:{transaction}})
    
    if (!result || !count) {
      throw ApiError.BadRequest(`Ошибка при создании уровня`)
    }
    
    return {
      item:result,
      count
    }
  })
  
  static get = createSlice<{
    item:ILevel
  },{ id?: number, name?: string }>(async ({data, options}) => {
    const transaction = options?.transaction
    
    const result = await levelModel.findOne({where: data, transaction: transaction.data})
    
    if (!result) {
      throw ApiError.BadRequest(`Ошибка при получении уровней`)
    }
    
    return {
      item:result
    }
  })
  
  static gets = createSlice<{
    list: ILevel[],
    count: number
  }>(async ({queries, options}) => {
    const transaction = options?.transaction
    const normalizeQueries = queriesNormalize(queries)
    
    const levels = await levelModel.findAll({
      where: {
        ...normalizeQueries.searched,
      },
      offset: normalizeQueries.offset,
      limit: normalizeQueries.limit,
      order: normalizeQueries.order,
      transaction: transaction.data
    })
    
    
    const {count} = await this.count({queries, options:{transaction}})
    
    const result = {
      list:levels,
      count
    }
    if (!result) {
      throw ApiError.BadRequest(`Ошибка при получении уровня`)
    }
    
    return result
  })
  
  static update = createSlice<{
    item:ILevel
  },Pick<ILevel, 'id' | 'name'>>(async ({data, options}) => {
    const transaction = options?.transaction
    
    const result = await levelModel.findOne({where: {id:data.id}, transaction: transaction.data})
    
    await result.update(data,{transaction: transaction.data})
    
    if (!result) {
      throw ApiError.BadRequest(`Ошибка при обновлении уровней`)
    }
    
    return {
      item: result
    }
  })
  
  
  static destroy = createSlice<{
    count:number
  },Pick<ILevel, 'id'>>(async ({data,queries, options}) => {
    const transaction = options?.transaction
    
    await levelModel.destroy({where: {id: data.id}, transaction: transaction.data})
    
    const {count} = await this.count({queries, options:{transaction}})
    
    return {
      count
    }
  })
  
  static destroys = createSlice<{
    count:number
  },{items:ILevel[]}>(async ({data, queries, options}) => {
    const transaction = options?.transaction
    
    const categories = await levelModel.destroy({
      where: {id: data.items.map((category) => category.dataValues.id)},
      transaction: transaction.data
    })
    const {count} = await this.count({queries, options:{transaction}})
    
    if (!categories) {
      throw ApiError.BadRequest(`Ошибка при удалении уровней`)
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
    
    const count = await levelModel.count({
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

export {levelService}