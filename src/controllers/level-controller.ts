import {NextFunction, Request, Response} from "express";
import {createDTO} from "../helpers/create-dto";
import controllerWrapper from "../helpers/controller-wrapper";
import {ApiError} from "../exceptions/api-error";
import {levelService} from "../services/level";
import {ILevel} from "../models/product/level-model";

class levelController {
  
  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const props = createDTO<ILevel,'name'>(req.body,['name'])
      const queries = req.query
      
      const category = await controllerWrapper(
        async (transaction) => {
          return await levelService.create({data:props, queries,options:{transaction}})
        },
        (error) => ApiError.BadRequest(`Ошибка при создании уровня`, error)
      )
      return res.status(200).json(category)
    } catch (e) {
      next(e)
    }
  }
  
  static async gets(req: Request, res: Response, next: NextFunction) {
    try {
      const queries = req.query
      
      const categories = await controllerWrapper(
        async (transaction) => {
          return await levelService.gets({queries, options:{transaction}})
        },
        (error) => ApiError.BadRequest(`Ошибка при получении уровней`, error)
      )
      
      return res.status(200).json(categories)
    } catch (e) {
      next(e)
    }
  }
  
  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const props = createDTO<ILevel,'id' |'name'>(req.body,['id','name'])
      
      const category = await controllerWrapper(
        async (transaction) => {
          return await levelService.update({data:props, options:{transaction}})
        },
        (error) => ApiError.BadRequest(`Ошибка при обновлении уровня`, error)
      )
      return res.status(200).json(category)
    } catch (e) {
      next(e)
    }
  }
  
  static async destroy(req: Request, res: Response, next: NextFunction) {
    try {
      const props = createDTO<ILevel,'id'>(req.body,['id'])
      const queries = req.query
      
      const category = await controllerWrapper(
        async (transaction) => {
          return await levelService.destroy({data:props, queries,options:{transaction}})
        },
        (error) => ApiError.BadRequest(`Ошибка при удалении уровня`, error)
      )
      return res.status(200).json(category)
    } catch (e) {
      next(e)
    }
  }
  
  
}

export {levelController}