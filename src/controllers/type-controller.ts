import {NextFunction, Request, Response} from "express";
import controllerWrapper from "../helpers/controller-wrapper";
import {ApiError} from "../exceptions/api-error";
import {typeService} from "../services/type";
import {createDTO} from "../helpers/create-dto";
import {IType} from "../models/product/type-model";

class typeController {
  
  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const props = createDTO<IType, keyof Pick<IType, 'basic' | 'value'>>(req.body,['basic','value'])
      const queries = req.query
      
      const type = await controllerWrapper(
        async (transaction) => {
          return await typeService.create({data: props, queries,options:{transaction}})
        },
        (error) => ApiError.BadRequest(`Ошибка при создании типа`, error)
      )
      
      return res.status(200).json(type)
    } catch (e) {
      next(e)
    }
  }
  
  static async gets(req: Request, res: Response, next: NextFunction) {
    try {
      const queries = req.query
      
      const types = await controllerWrapper(
        async (transaction) => {
          return await typeService.gets({queries,options:{transaction}})
        },
        (error) => ApiError.BadRequest(`Ошибка при получении типов`, error)
      )
      
      return res.status(200).json(types)
    } catch (e) {
      next(e)
    }
  }
  
  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const props = createDTO<IType, keyof Pick<IType, 'id' | 'value'>>(req.body,['id','value'])
      
      const type = await controllerWrapper(
        async (transaction) => {
          return await typeService.update({data: props,options:{transaction}})
        },
        (error) => ApiError.BadRequest(`Ошибка при обновлении типа`, error)
      )
      
      return res.status(200).json(type)
    } catch (e) {
      next(e)
    }
  }
  
  static async destroy(req: Request, res: Response, next: NextFunction) {
    try {
      const props = createDTO<IType, keyof Pick<IType, 'id' >>(req.body,['id'])
      const queries = req.query
      
      const type = await controllerWrapper(
        async (transaction) => {
          return await typeService.destroy({data: props, queries,options:{transaction}})
        },
        (error) => ApiError.BadRequest(`Ошибка при удалении типа`, error)
      )
      
      return res.status(200).json(type)
    } catch (e) {
      next(e)
    }
  }
  
}

export {typeController}