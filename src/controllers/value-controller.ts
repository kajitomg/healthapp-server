import { ApiError } from "../exceptions/api-error";
import {NextFunction, Request, Response} from "express";
import controllerWrapper from "../helpers/controller-wrapper";
import {valueService} from "../services/value";


class valueController {
  
  static async create(req:Request, res:Response, next:NextFunction) {
    try {
      const data = req.body
      
      const value = await controllerWrapper(
        async (transaction) => {
          return await valueService.create({...data }, { transaction })
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
      const data = req.body
      
      const value = await controllerWrapper(
        async (transaction) => {
          return await valueService.get({id:data.id}, { transaction })
        },
        (error) => ApiError.BadRequest(`Ошибка при получении значения`, error)
      )
      
      return res.status(200).json(value)
    } catch (e) {
      next(e)
    }
  }
  
}

export { valueController }