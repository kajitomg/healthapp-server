import { ApiError } from "../exceptions/api-error";
import {NextFunction, Request, Response} from "express";
import controllerWrapper from "../helpers/controller-wrapper";
import {createDTO} from "../helpers/create-dto";
import {IProduct} from "../models/product/product-model";
import {cartService} from "../services/cart";


class cartController {
  
  static async get(req:Request, res:Response, next:NextFunction) {
    try {
      const params = createDTO<{ id?:number }, 'id'>(req.params,['id'])
      const queries = req.query
    
      const cart = await controllerWrapper(
        async (transaction) => {
          return await cartService.get({data:{userId:params.id},queries,options:{ transaction }})
        },
        (error) => ApiError.BadRequest(`Ошибка при получении корзины`, error)
      )
      
      return res.status(200).json(cart)
    } catch (e) {
      next(e)
    }
  }
  
  static async addProducts(req: Request, res: Response, next: NextFunction) {
    try {
      const props = createDTO<{ products:IProduct[] }, 'products'>(req.body,['products'])
      const params = createDTO<{ id?:number }, 'id'>(req.params,['id'])

      const cart = await controllerWrapper(
        async (transaction) => {
          return await cartService.addProducts({data:{...props,...params}, options:{transaction}})
        },
        (error) => ApiError.BadRequest(`Ошибка при добавлении продуктов в корзину`, error)
      )
      
      return res.status(200).json(cart)
    } catch (e) {
      next(e)
    }
  }
  
  static async deleteProducts(req: Request, res: Response, next: NextFunction) {
    try {
      const props = createDTO<{ products:IProduct[] }, 'products'>(req.body,['products'])
      const params = createDTO<{ id?:number }, 'id'>(req.params,['id'])

      const cart = await controllerWrapper(
        async (transaction) => {
          return await cartService.deleteProducts({data:{...props,...params}, options:{transaction}})
        },
        (error) => ApiError.BadRequest(`Ошибка при удалении продуктов из корзины`, error)
      )
      
      return res.status(200).json(cart)
    } catch (e) {
      next(e)
    }
  }
  
  static async incrementProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const props = createDTO<{ product:IProduct }, 'product'>(req.body,['product'])
      const params = createDTO<{ id?:number }, 'id'>(req.params,['id'])

      const cart = await controllerWrapper(
        async (transaction) => {
          return await cartService.incrementProduct({data:{...props,...params}, options:{transaction}})
        },
        (error) => ApiError.BadRequest(`Ошибка при увеличении количества продуктов в корзине`, error)
      )
      
      return res.status(200).json(cart)
    } catch (e) {
      next(e)
    }
  }
  
  static async decrementProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const props = createDTO<{ product:IProduct }, 'product'>(req.body,['product'])
      const params = createDTO<{ id?:number }, 'id'>(req.params,['id'])
      
      const cart = await controllerWrapper(
        async (transaction) => {
          return await cartService.decrementProduct({data:{...props,...params}, options:{transaction}})
        },
        (error) => ApiError.BadRequest(`Ошибка при уменьшении количества продуктов в корзине`, error)
      )
      
      return res.status(200).json(cart)
    } catch (e) {
      next(e)
    }
  }
  
}

export { cartController }