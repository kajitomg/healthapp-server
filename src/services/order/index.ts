import {ApiError} from "../../exceptions/api-error";
import {MyTransactionType} from "../../helpers/transaction";
import {orderModel} from "../../models";
import queriesNormalize from "../../helpers/queries-normalize";
import {IOrder} from "../../models/order/order-model";
import createSlice from "../../helpers/create-slice";

const t: MyTransactionType = require('../../helpers/transaction')

class orderService {
  
  static create = createSlice<{
    item:IOrder,
    count:number
  },Pick<IOrder,'comment' | 'phonenumber' | 'customerId' | 'statusId'>>(async ({data,queries, options}) => {
    const transaction = options?.transaction
    
    const order = await orderModel.create(data, {transaction: transaction.data})
    
    const {count} = await this.count({queries, options:{transaction}})
    
    if (!order|| !count) {
      await t.rollback(transaction.data)
      throw ApiError.BadRequest(`Ошибка при создании заказа`)
    }
    
    return {
      item:order,
      count
    }
  })
  
  static get = createSlice<{
    item:IOrder
  },IOrder>(async ({data, options}) => {
    const transaction = options?.transaction
    
    const result = await orderModel.findOne({where: data, transaction: transaction.data})
    
    if (!result) {
      await t.rollback(transaction.data)
      throw ApiError.BadRequest(`Ошибка при получении заказа`)
    }
    
    return result
    
  })
  
  static gets = createSlice<{
    list: IOrder[],
    count: number
  }>(async ({queries, options}) => {
    const transaction = options?.transaction
    const normalizeQueries = queriesNormalize(queries)
    
    const orders = await orderModel.findAll({
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
      list:orders,
      count
    }
    if (!result) {
      await t.rollback(transaction.data)
      throw ApiError.BadRequest(`Ошибка при получении заказов`)
    }
    
    return result
  })
  
  static update = createSlice<{
    item:IOrder
  },IOrder>(async ({data, options}) => {
    const transaction = options?.transaction
    
    const order = await orderModel.update(data, {where: {id: data.id}, transaction: transaction.data})
    
    if (!order) {
      await t.rollback(transaction.data)
      throw ApiError.BadRequest(`Ошибка при обновлении заказа`)
    }
    
    return order
    
  })
  
  
  static destroy = createSlice<{
    count:number
  },Pick<IOrder, 'id'>>(async ({data,queries, options}) => {
    const transaction = options?.transaction
    
    const order = await orderModel.findOne({
      where: {id: data.id},
      transaction: transaction.data
    })
    
    await order.destroy({transaction: transaction.data})
    
    const {count} = await this.count({queries, options:{transaction}})
    
    return {count}
    
  })
  
  static destroys = createSlice<{
    count:number
  },{items:IOrder[]}>(async ({data, queries, options}) => {
    const transaction = options?.transaction
    
    await orderModel.destroy({
      where: {id: data.items.map((value) => value.dataValues.id)},
      transaction: transaction.data
    })
    const {count} = await this.count({queries, options:{transaction}})
    
    return {
      count
    }
  })
  
  static count = createSlice<{
    count: number
  }>(async ({queries, options}) => {
    const transaction = options?.transaction
    const normalizeQueries = queriesNormalize(queries)
    
    const count = await orderModel.count({
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

export {orderService}