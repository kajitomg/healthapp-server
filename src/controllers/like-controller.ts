import { ApiError } from "../exceptions/api-error";
import {NextFunction, Request, Response} from "express";
import controllerWrapper from "../helpers/controller-wrapper";
import {createDTO} from "../helpers/create-dto";
import {IProduct} from "../models/product/product-model";
import {likeService} from "../services/like";


class likeController {
  
  static async get(req:Request, res:Response, next:NextFunction) {
    try {
      const params = createDTO<{ id?:number }, 'id'>(req.params,['id'])
      const queries = req.query
      
      const like = await controllerWrapper(
        async (transaction) => {
          return await likeService.get({data:{userId:params.id},queries,options:{ transaction }})
        },
        (error) => ApiError.BadRequest(`Ошибка при получении понравившегося`, error)
      )
      
      return res.status(200).json(like)
    } catch (e) {
      next(e)
    }
  }
  
  static async addProducts(req: Request, res: Response, next: NextFunction) {
    try {
      const props = createDTO<{ products:IProduct[] }, 'products'>(req.body,['products'])
      const params = createDTO<{ id?:number }, 'id'>(req.params,['id'])
      
      const like = await controllerWrapper(
        async (transaction) => {
          return await likeService.addProducts({data:{...props,...params}, options:{transaction}})
        },
        (error) => ApiError.BadRequest(`Ошибка при добавлении продуктов в понравившееся`, error)
      )
      
      return res.status(200).json(like)
    } catch (e) {
      next(e)
    }
  }
  
  static async deleteProducts(req: Request, res: Response, next: NextFunction) {
    try {
      const props = createDTO<{ products:IProduct[] }, 'products'>(req.body,['products'])
      const params = createDTO<{ id?:number }, 'id'>(req.params,['id'])
      
      const like = await controllerWrapper(
        async (transaction) => {
          return await likeService.deleteProducts({data:{...props,...params}, options:{transaction}})
        },
        (error) => ApiError.BadRequest(`Ошибка при удалении продуктов из понравившегося`, error)
      )
      
      return res.status(200).json(like)
    } catch (e) {
      next(e)
    }
  }
  
}

export { likeController }