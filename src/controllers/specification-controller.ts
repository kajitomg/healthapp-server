import {ApiError} from "../exceptions/api-error";
import {specificationService} from "../services/specification";
import controllerWrapper from "../helpers/controller-wrapper";


class specificationController {
  
  static async create(req, res, next) {
    try {
      const data = req.body
      
      const specification = await controllerWrapper(
        async (transaction) => {
          return await specificationService.create(data, {transaction})
        },
        (error) => ApiError.BadRequest(`Ошибка при создании характеристики`, error)
      )
      
      return res.status(200).json(specification)
    } catch (e) {
      next(e)
    }
  }
  
  static async gets(req, res, next) {
    try {
      const queries = req.query
      
      const specification = await controllerWrapper(
        async (transaction) => {
          return await specificationService.gets(queries, {transaction})
        },
        (error) => ApiError.BadRequest(`Ошибка при получении характеристик`, error)
      )
      
      return res.status(200).json(specification)
    } catch (e) {
      next(e)
    }
  }
  
  static async update(req, res, next) {
    try {
      const data = req.body
      
      const specification = await controllerWrapper(
        async (transaction) => {
          return await specificationService.update(data, {transaction})
        },
        (error) => ApiError.BadRequest(`Ошибка при обновлении характеристики`, error)
      )
      
      return res.status(200).json(specification)
    } catch (e) {
      next(e)
    }
  }
  
  static async destroy(req, res, next) {
    try {
      const data = req.body
      
      const specification = await controllerWrapper(
        async (transaction) => {
          return await specificationService.destroy(data, {transaction})
        },
        (error) => ApiError.BadRequest(`Ошибка при удалении характеристики`, error)
      )
      
      return res.status(200).json(specification)
    } catch (e) {
      next(e)
    }
  }
  
  static async addValue(req, res, next) {
    try {
      const data = req.body
      
      const specification = await controllerWrapper(
        async (transaction) => {
          return await specificationService.addValue(data, {transaction})
        },
        (error) => ApiError.BadRequest(`Ошибка при добавлении значения характеристики`, error)
      )
      
      return res.status(200).json(specification)
    } catch (e) {
      next(e)
    }
  }
  
  static async destroyValue(req, res, next) {
    try {
      const data = req.body
      
      const specification = await controllerWrapper(
        async (transaction) => {
          return await specificationService.destroyValue(data, {transaction})
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