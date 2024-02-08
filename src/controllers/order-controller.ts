import {ApiError} from "../exceptions/api-error";
import controllerWrapper from "../helpers/controller-wrapper";
import {NextFunction, Request, Response} from "express";
import {orderService} from "../services/order";
import {createDTO} from "../helpers/create-dto";
import {IOrder} from "../models/order/order-model";


class orderController {
  
  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const props = createDTO<IOrder, 'statusId' | 'customerId' | 'comment' | 'phonenumber' >(req.body,['comment','phonenumber','customerId','statusId'])
      const queries = req.query
      
      const order = await controllerWrapper(
        async (transaction) => {
          return await orderService.create({data:props, queries,options:{transaction}})
        },
        (error) => ApiError.BadRequest(`Ошибка при создании заказа`, error)
      )
      
      return res.status(200).json(order)
    } catch (e) {
      next(e)
    }
  }
  
  static async gets(req: Request, res: Response, next: NextFunction) {
    try {
      const queries = req.query
      
      const order = await controllerWrapper(
        async (transaction) => {
          return await orderService.gets({queries, options:{transaction}})
        },
        (error) => ApiError.BadRequest(`Ошибка при получении заказов`, error)
      )
      
      return res.status(200).json(order)
    } catch (e) {
      next(e)
    }
  }
  
  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const props = createDTO<IOrder, keyof IOrder>(req.body,['comment','phonenumber','customerId','statusId','id'])
      
      const order = await controllerWrapper(
        async (transaction) => {
          return await orderService.update({data:props, options:{transaction}})
        },
        (error) => ApiError.BadRequest(`Ошибка при обновлении заказа`, error)
      )
      
      return res.status(200).json(order)
    } catch (e) {
      next(e)
    }
  }
  
  static async destroy(req: Request, res: Response, next: NextFunction) {
    try {
      const props = createDTO<IOrder, 'id'>(req.body,['id'])
      const queries = req.query
      
      const order = await controllerWrapper(
        async (transaction) => {
          return await orderService.destroy({data:props, queries,options:{transaction}})
        },
        (error) => ApiError.BadRequest(`Ошибка при удалении заказа`, error)
      )
      
      return res.status(200).json(order)
    } catch (e) {
      next(e)
    }
  }
  
}

export {orderController}