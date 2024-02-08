import { ApiError } from "../exceptions/api-error";
import {NextFunction, Request, Response} from "express";
import controllerWrapper from "../helpers/controller-wrapper";
import {valueService} from "../services/value";
import {createDTO} from "../helpers/create-dto";
import {IValue} from "../models/product/value-model";


class valueController {
  
  static async create(req:Request, res:Response, next:NextFunction) {
    try {
      const props = createDTO<IValue, keyof Pick<IValue, 'value' | 'basic' >>(req.body,['value', 'basic'])
      const queries = req.query
      
      const value = await controllerWrapper(
        async (transaction) => {
          return await valueService.create({data: props, queries,options:{transaction}})
        },
        (error) => ApiError.BadRequest(`Ошибка при создании значения`, error)
      )
      
      return res.status(200).json(value)
    } catch (e) {
      next(e)
    }
  }
  
  static async get(req: Request, res: Response, next: NextFunction) {
    try {
      const props = createDTO<IValue, keyof Pick<IValue, 'value' | 'id' >>(req.body,['value', 'id'])
      
      const value = await controllerWrapper(
        async (transaction) => {
          return await valueService.get({data: props,options:{transaction}})
        },
        (error) => ApiError.BadRequest(`Ошибка при получении значения`, error)
      )
      
      return res.status(200).json(value)
    } catch (e) {
      next(e)
    }
  }
  
  static async gets(req: Request, res: Response, next: NextFunction) {
    try {
      const queries = req.query
      
      const value = await controllerWrapper(
        async (transaction) => {
          return await valueService.gets({queries,options:{transaction}})
        },
        (error) => ApiError.BadRequest(`Ошибка при получении значений`, error)
      )
      
      return res.status(200).json(value)
    } catch (e) {
      next(e)
    }
  }
  
  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const props = createDTO<IValue, keyof Pick<IValue, 'value' | 'id' >>(req.body,['value', 'id'])
      
      const value = await controllerWrapper(
        async (transaction) => {
          return await valueService.update({data: props,options:{transaction}})
        },
        (error) => ApiError.BadRequest(`Ошибка при обновлении значения`, error)
      )
      
      return res.status(200).json(value)
    } catch (e) {
      next(e)
    }
  }
  
  static async destroy(req: Request, res: Response, next: NextFunction) {
    try {
      const props = createDTO<IValue, keyof Pick<IValue, 'id' >>(req.body,['id'])
      const queries = req.query
      
      const value = await controllerWrapper(
        async (transaction) => {
          return await valueService.destroy({data: props, queries,options:{transaction}})
        },
        (error) => ApiError.BadRequest(`Ошибка при удалении значения`, error)
      )
      
      return res.status(200).json(value)
    } catch (e) {
      next(e)
    }
  }
  
}

export { valueController }