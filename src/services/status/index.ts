import {ApiError} from "../../exceptions/api-error";
import queriesNormalize from "../../helpers/queries-normalize";
import {IStatus} from "../../models/order/status-model";
import {statusModel} from "../../models";
import createSlice from "../../helpers/create-slice";


class statusService {
  
  static create = createSlice<{
    item:IStatus,
    count:number
  },Pick<IStatus, 'value'>>(async ({data,queries, options}) => {
    const transaction = options?.transaction
    
    const status = await statusModel.create(data, {transaction: transaction.data})
    
    const {count} = await this.count({queries, options:{transaction}})
    
    if (!status|| !count) {
      throw ApiError.BadRequest(`Ошибка при создании статуса`)
    }
    
    return {
      item:status,
      count
    }
  })
  
  static get = createSlice<{
  item:IStatus
},Partial<Pick<IStatus, 'value' | 'id'>>>(async ({data, options}) => {
    const transaction = options?.transaction
    
    const result = await statusModel.findOne({where: data, transaction: transaction.data})
    
    if (!result) {
      throw ApiError.BadRequest(`Ошибка при получении статуса`)
    }
    
    return {
      item:result
    }
  })
  
  static gets = createSlice<{
    list: IStatus[],
    count: number
  }>(async ({queries, options}) => {
    const transaction = options?.transaction
    const normalizeQueries = queriesNormalize(queries)
    
    const statuses = await statusModel.findAll({
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
      list:statuses,
      count
    }
    if (!result) {
      throw ApiError.BadRequest(`Ошибка при получении статусов`)
    }
    
    return result
  })
  
  static update = createSlice<{
    item:IStatus
  },Pick<IStatus, 'id' | 'value'>>(async ({data, options}) => {
    const transaction = options?.transaction
    
    const status = await statusModel.update(data, {where: {id: data.id}, transaction: transaction.data})
    
    if (!status) {
      throw ApiError.BadRequest(`Ошибка при обновлении статуса`)
    }
    
    return {
      item:status
    }
    
  })
  
  
  static destroy = createSlice<{
    count:number
  },Pick<IStatus, 'id'>>(async ({data, queries, options}) => {
    const transaction = options?.transaction
    
    const status = await statusModel.findOne({
      where: {id: data.id},
      transaction: transaction.data
    })
    
    await status.destroy({transaction: transaction.data})
    
    const {count} = await this.count({queries, options:{transaction}})
    
    return {count}
    
  })
  
  static destroys = createSlice<{
    count:number
  },{items:IStatus[]}>(async ({data, queries, options}) => {
    const transaction = options?.transaction
    
    await statusModel.destroy({
      where: {id: data.items.map((value) => value.dataValues.id)},
      transaction: transaction.data
    })
    
    const {count} = await this.count({queries, options:{transaction}})
    
    return {
      count
    }
  })
  
  static count = createSlice<{ count: number }>(async ({queries, options}) => {
    const transaction = options?.transaction
    const normalizeQueries = queriesNormalize(queries)
    
    const count = await statusModel.count({
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

export {statusService}