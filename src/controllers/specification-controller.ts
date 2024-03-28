import {ApiError} from "../exceptions/api-error";
import {specificationService} from "../services/specification";
import controllerWrapper from "../helpers/controller-wrapper";
import {NextFunction, Request, Response} from "express";
import {createDTO} from "../helpers/create-dto";
import {ISpecification} from "../models/product/specification-model";


class specificationController {
  
  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const props = createDTO<ISpecification, keyof Pick<ISpecification, 'typeId' | 'basic' | 'name' | 'categoryId'>>(req.body,['typeId', 'categoryId', 'basic', 'name'])
      const queries = req.query
      
      const specification = await controllerWrapper(
        async (transaction) => {
          return await specificationService.create({data:props, queries,options:{transaction}})
        },
        (error) => ApiError.BadRequest(`Ошибка при создании характеристики`, error)
      )
      
      return res.status(200).json(specification)
    } catch (e) {
      next(e)
    }
  }
  
  static async gets(req: Request, res: Response, next: NextFunction) {
    try {
      const queries = req.query
      
      const specification = await controllerWrapper(
        async (transaction) => {
          return await specificationService.gets({queries, options:{transaction}})
        },
        (error) => ApiError.BadRequest(`Ошибка при получении характеристик`, error)
      )
      
      return res.status(200).json(specification)
    } catch (e) {
      next(e)
    }
  }
  
  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const props = createDTO<ISpecification, keyof Pick<ISpecification, 'id' | 'typeId' | 'basic' | 'name' | 'categoryId'>>(req.body,['id', 'typeId', 'categoryId', 'basic', 'name'])
      
      const specification = await controllerWrapper(
        async (transaction) => {
          return await specificationService.update({data:props, options:{transaction}})
        },
        (error) => ApiError.BadRequest(`Ошибка при обновлении характеристики`, error)
      )
      
      return res.status(200).json(specification)
    } catch (e) {
      next(e)
    }
  }
  
  static async destroy(req: Request, res: Response, next: NextFunction) {
    try {
      const props = createDTO<ISpecification, keyof Pick<ISpecification, 'id'>>(req.body,['id'])
      const queries = req.query
      
      const specification = await controllerWrapper(
        async (transaction) => {
          return await specificationService.destroy({data: props, queries, options:{transaction}})
        },
        (error) => ApiError.BadRequest(`Ошибка при удалении характеристики`, error)
      )
      
      return res.status(200).json(specification)
    } catch (e) {
      next(e)
    }
  }
  
  static async addValue(req: Request, res: Response, next: NextFunction) {
    try {
      const {specificationId, valueId} = req.body
      
      const specification = await controllerWrapper(
        async (transaction) => {
          return await specificationService.addValue({data: {specificationId,valueId}, options:{transaction}})
        },
        (error) => ApiError.BadRequest(`Ошибка при добавлении значения характеристики`, error)
      )
      
      return res.status(200).json(specification)
    } catch (e) {
      next(e)
    }
  }
  
  static async destroyValue(req: Request, res: Response, next: NextFunction) {
    try {
      const {specificationId, valueId} = req.body
      
      const specification = await controllerWrapper(
        async (transaction) => {
          return await specificationService.destroyValue({data: {specificationId,valueId}, options:{transaction}})
        },
        (error) => ApiError.BadRequest(`Ошибка при удалении значения характеристики`, error)
      )
      
      return res.status(200).json(specification)
    } catch (e) {
      next(e)
    }
  }
  
}

export {specificationController}