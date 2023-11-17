import {ApiError} from "../exceptions/api-error";
import {categoryService} from "../services/category";
import controllerWrapper from "../helpers/controller-wrapper";
import {NextFunction, Request, Response} from "express";


class categoryController {
  
  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const data = req.body
      
      const category = await controllerWrapper(
        async (transaction) => {
          return await categoryService.create(data, {transaction})
        },
        (error) => ApiError.BadRequest(`Ошибка при создании категории`, error)
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
          return await categoryService.gets(queries, {transaction})
        },
        (error) => ApiError.BadRequest(`Ошибка при получении категорий`, error)
      )
      
      return res.status(200).json(categories)
    } catch (e) {
      next(e)
    }
  }
  
  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const data = req.body
      
      const category = await controllerWrapper(
        async (transaction) => {
          return await categoryService.update(data, {transaction})
        },
        (error) => ApiError.BadRequest(`Ошибка при обновлении категории`, error)
      )
      return res.status(200).json(category)
    } catch (e) {
      next(e)
    }
  }
  
  static async destroy(req: Request, res: Response, next: NextFunction) {
    try {
      const data = req.body
      
      const category = await controllerWrapper(
        async (transaction) => {
          return await categoryService.destroy(data, {transaction})
        },
        (error) => ApiError.BadRequest(`Ошибка при удалении категории`, error)
      )
      return res.status(200).json(category)
    } catch (e) {
      next(e)
    }
  }
  
}

export {categoryController}