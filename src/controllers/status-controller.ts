import {ApiError} from "../exceptions/api-error";
import controllerWrapper from "../helpers/controller-wrapper";
import {NextFunction, Request, Response} from "express";
import {statusService} from "../services/status";
import {createDTO} from "../helpers/create-dto";
import {IStatus} from "../models/order/status-model";


class statusController {
  
  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const props = createDTO<IStatus, keyof Pick<IStatus, 'value'>>(req.body,['value'])
      const queries = req.query
      
      const status = await controllerWrapper(
        async (transaction) => {
          return await statusService.create({data: props, queries,options:{transaction}})
        },
        (error) => ApiError.BadRequest(`Ошибка при создании статуса`, error)
      )
      
      return res.status(200).json(status)
    } catch (e) {
      next(e)
    }
  }
  
  static async gets(req: Request, res: Response, next: NextFunction) {
    try {
      const queries = req.query
      
      const status = await controllerWrapper(
        async (transaction) => {
          return await statusService.gets({queries,options:{transaction}})
        },
        (error) => ApiError.BadRequest(`Ошибка при получении статусов`, error)
      )
      
      return res.status(200).json(status)
    } catch (e) {
      next(e)
    }
  }
  
  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const props = createDTO<IStatus, keyof Pick<IStatus, 'id' | 'value'>>(req.body,['id','value'])
      
      const status = await controllerWrapper(
        async (transaction) => {
          return await statusService.update({data: props,options:{transaction}})
        },
        (error) => ApiError.BadRequest(`Ошибка при обновлении статуса`, error)
      )
      
      return res.status(200).json(status)
    } catch (e) {
      next(e)
    }
  }
  
  static async destroy(req: Request, res: Response, next: NextFunction) {
    try {
      const props = createDTO<IStatus, keyof Pick<IStatus, 'id'>>(req.body,['id'])
      const queries = req.query
      
      const status = await controllerWrapper(
        async (transaction) => {
          return await statusService.destroy({data: props, queries,options:{transaction}})
        },
        (error) => ApiError.BadRequest(`Ошибка при удалении статуса`, error)
      )
      
      return res.status(200).json(status)
    } catch (e) {
      next(e)
    }
  }
  
}

export {statusController}