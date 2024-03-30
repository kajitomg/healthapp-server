import {ApiError} from "../../exceptions/api-error";
import queriesNormalize from "../../helpers/queries-normalize";
import {IOrder, orderModel} from "../../models/order/order-model";
import createSlice from "../../helpers/create-slice";
import {statusService} from "../status";
import {userService} from "../user";
import {orderCustomerModel} from "../../models/order/order-customer-model";
import {orderProductModel} from "../../models/order/order-product-model";


class orderService {
  
  static create = createSlice<{
    item:IOrder,
    count:number
  },Pick<IOrder,'comment' | 'phonenumber' | 'email' | 'customerId' | 'statusId' | 'products'>>(async ({data,queries, options}) => {
    const transaction = options?.transaction
    let statusId = data.statusId
    
    if(!data.statusId) {
      const {item} = await statusService.get({data:{value:'Сформирован'},options:{transaction}})
      statusId = item.id
    }

    const order = await orderModel.create({...data,statusId}, {transaction: transaction.data})
    
    const {item:user} = await userService.getOneById({data:{id:data.customerId},options:{transaction}})
    
    
    await orderCustomerModel.create({customerId:data.customerId,orderId:order.id},{through: {selfGranted: false},ignoreDuplicates:true,transaction:transaction.data})

    const list = data.products.map((product) => {
      return {productId:product.id,orderId:order.id,count:product?.['cart-products']?.[0]?.count || 1}
    })
    await orderProductModel.bulkCreate(list, {ignoreDuplicates:true,transaction:transaction.data})
    
    const {count} = await this.count({queries, options:{transaction}})
    
    if (!order|| !count) {
      throw ApiError.BadRequest(`Ошибка при создании заказа`)
    }
    
    return {
      item:order,
      count
    }
  })
  
  static get = createSlice<{
    item:IOrder
  },Omit<IOrder, 'products'>>(async ({data, options}) => {
    const transaction = options?.transaction
    
    const result = await orderModel.findOne({where: data, transaction: transaction.data})
    
    if (!result) {
      throw ApiError.BadRequest(`Ошибка при получении заказа`)
    }
    
    return {
      item:result
    }
    
  })
  
  static gets = createSlice<{
    list: IOrder[],
    count: number
  }>(async ({queries, options}) => {
    const transaction = options?.transaction
    const normalizeQueries = queriesNormalize(queries)
    
    const orders = await orderModel.findAll({
      where: {
        ...normalizeQueries.searched,
        ...normalizeQueries.filter,
        ...normalizeQueries.data
      },
      offset: normalizeQueries.offset,
      include: normalizeQueries.include,
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
      throw ApiError.BadRequest(`Ошибка при получении заказов`)
    }
    
    return result
  })
  
  static update = createSlice<{
    item:IOrder
  },IOrder>(async ({data, options}) => {
    const transaction = options?.transaction
    
    await orderModel.update(data, {where: {id: data.id}, transaction: transaction.data})
    const order = await orderModel.findOne({where: {id: data.id}, transaction: transaction.data})
    
    if (!order) {
      throw ApiError.BadRequest(`Ошибка при обновлении заказа`)
    }
    
    return {
      item:order
    }
    
  })
  
  
  static destroy = createSlice<{
    count:number
  },Partial<Pick<IOrder, 'id'>>>(async ({data,queries, options}) => {
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
      transaction: transaction.data,
    })
    
    return {
      count
    }
  })
  
}

export {orderService}