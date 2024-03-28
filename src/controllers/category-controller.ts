import {ApiError} from "../exceptions/api-error";
import {categoryService} from "../services/category";
import controllerWrapper from "../helpers/controller-wrapper";
import {NextFunction, Request, Response} from "express";
import {createDTO} from "../helpers/create-dto";
import {ICategory} from "../models/product/category-model";


class categoryController {
  
  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const props = createDTO<ICategory,'name' | 'levelId'>(req.body,['name', "levelId"])
      const queries = req.query
      
      const category = await controllerWrapper(
        async (transaction) => {
          return await categoryService.create({data:props, queries,options:{transaction}})
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
          return await categoryService.gets({queries, options:{transaction}})
        },
        (error) => ApiError.BadRequest(`Ошибка при получении категорий`, error)
      )
      
      return res.status(200).json(categories)
    } catch (e) {
      next(e)
    }
  }
  
  static async get(req: Request, res: Response, next: NextFunction) {
    try {
      const queries = req.query
      const params = req.params
      
      
      const categories = await controllerWrapper(
        async (transaction) => {
          return await categoryService.get({data:params,queries, options:{transaction}})
        },
        (error) => ApiError.BadRequest(`Ошибка при получении категории`, error)
      )
      
      return res.status(200).json(categories)
    } catch (e) {
      next(e)
    }
  }
  
  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const props = createDTO<ICategory,'id' |'name'>(req.body,['id','name'])
      
      const category = await controllerWrapper(
        async (transaction) => {
          return await categoryService.update({data:props, options:{transaction}})
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
      const props = createDTO<ICategory,'id'>(req.body,['id'])
      const queries = req.query
      
      const category = await controllerWrapper(
        async (transaction) => {
          return await categoryService.destroy({data:props, queries,options:{transaction}})
        },
        (error) => ApiError.BadRequest(`Ошибка при удалении категории`, error)
      )
      return res.status(200).json(category)
    } catch (e) {
      next(e)
    }
  }
  
  static async addChildren(req: Request, res: Response, next: NextFunction) {
    try {
      const { parentId,childrenId } = req.body
      const queries = req.query
      
      const category = await controllerWrapper(
        async (transaction) => {
          return await categoryService.addChildren({data:{ parentId,childrenId }, queries,options:{transaction}})
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