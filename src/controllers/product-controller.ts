import {ApiError} from "../exceptions/api-error";
import {DTOService} from "../services/dto";
import {productService} from "../services/product";
import {NextFunction, Request, Response} from "express";
import controllerWrapper from "../helpers/controller-wrapper";


class productController {
  
  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const data = req.body
      
      const product = await controllerWrapper(
        async (transaction) => {
          return await productService.create(DTOService.product(data), {transaction})
        },
        (error) => ApiError.BadRequest(`Ошибка при создании продукта`, error)
      )
      
      return res.status(200).json(product)
    } catch (e) {
      next(e)
    }
  }
  
  static async gets(req: Request, res: Response, next: NextFunction) {
    try {
      const queries = req.query
      
      const products = await controllerWrapper(
        async (transaction) => {
          return await productService.gets(queries, {transaction})
        },
        (error) => ApiError.BadRequest(`Ошибка при получении продуктов`, error)
      )
      
      return res.status(200).json(products)
    } catch (e) {
      next(e)
    }
  }
  
  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const data = req.body
      
      const product = await controllerWrapper(
        async (transaction) => {
          return await productService.update(DTOService.product(data), {transaction})
        },
        (error) => ApiError.BadRequest(`Ошибка при обновлении продукта`, error)
      )
      
      return res.status(200).json(product)
    } catch (e) {
      next(e)
    }
  }
  
  static async destroy(req: Request, res: Response, next: NextFunction) {
    try {
      const data = req.body
      
      const product = await controllerWrapper(
        async (transaction) => {
          return await productService.destroy(data, {transaction})
        },
        (error) => ApiError.BadRequest(`Ошибка при удалении продукта`, error)
      )
      
      return res.status(200).json(product)
    } catch (e) {
      next(e)
    }
  }
  
  static async images(req: Request, res: Response, next: NextFunction) {
    try {
      const data = req.body
      
      const product = await controllerWrapper(
        async (transaction) => {
          return await productService.images(data, {transaction})
        },
        (error) => ApiError.BadRequest(`Ошибка при получении изображений`, error)
      )
      
      return res.status(200).json(product)
    } catch (e) {
      next(e)
    }
  }
  
  static async documents(req: Request, res: Response, next: NextFunction) {
    try {
      const data = req.body
      
      const product = await controllerWrapper(
        async (transaction) => {
          return await productService.documents(data, {transaction})
        },
        (error) => ApiError.BadRequest(`Ошибка при получении документов`, error)
      )
      
      return res.status(200).json(product)
    } catch (e) {
      next(e)
    }
  }
  
  static async categories(req: Request, res: Response, next: NextFunction) {
    try {
      const data = req.body
      
      const product = await controllerWrapper(
        async (transaction) => {
          return await productService.categories(data, {transaction})
        },
        (error) => ApiError.BadRequest(`Ошибка при получении категорий`, error)
      )
      
      return res.status(200).json(product)
    } catch (e) {
      next(e)
    }
  }
  
  static async specifications(req: Request, res: Response, next: NextFunction) {
    try {
      const data = req.body
      
      const product = await controllerWrapper(
        async (transaction) => {
          return await productService.specifications(data, {transaction})
        },
        (error) => ApiError.BadRequest(`Ошибка при получении характеристик`, error)
      )
      
      return res.status(200).json(product)
    } catch (e) {
      next(e)
    }
  }
  
  static async addImage(req: Request, res: Response, next: NextFunction) {
    try {
      const data = req.body
      
      const product = await controllerWrapper(
        async (transaction) => {
          return await productService.addImage(data, {transaction})
        },
        (error) => ApiError.BadRequest(`Ошибка при добавлении изображения`, error)
      )
      
      return res.status(200).json(product)
    } catch (e) {
      next(e)
    }
  }
  
  static async destroyImage(req: Request, res: Response, next: NextFunction) {
    try {
      const data = req.body
      
      const product = await controllerWrapper(
        async (transaction) => {
          return await productService.destroyImage(data, {transaction})
        },
        (error) => ApiError.BadRequest(`Ошибка при удалении изображения`, error)
      )
      
      return res.status(200).json(product)
    } catch (e) {
      next(e)
    }
  }
  
  static async addDocument(req: Request, res: Response, next: NextFunction) {
    try {
      const data = req.body
      
      const product = await controllerWrapper(
        async (transaction) => {
          return await productService.addDocument(data, {transaction})
        },
        (error) => ApiError.BadRequest(`Ошибка при добавлении документа`, error)
      )
      
      return res.status(200).json(product)
    } catch (e) {
      next(e)
    }
  }
  
  static async destroyDocument(req: Request, res: Response, next: NextFunction) {
    try {
      const data = req.body
      
      const product = await controllerWrapper(
        async (transaction) => {
          return await productService.destroyDocument(data, {transaction})
        },
        (error) => ApiError.BadRequest(`Ошибка при удалении документа`, error)
      )
      
      return res.status(200).json(product)
    } catch (e) {
      next(e)
    }
  }
  
  static async addCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const data = req.body
      
      const product = await controllerWrapper(
        async (transaction) => {
          return await productService.addCategory(data, {transaction})
        },
        (error) => ApiError.BadRequest(`Ошибка при добавлении категории`, error)
      )
      
      return res.status(200).json(product)
    } catch (e) {
      next(e)
    }
  }
  
  static async destroyCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const data = req.body
      
      const product = await controllerWrapper(
        async (transaction) => {
          return await productService.destroyCategory(data, {transaction})
        },
        (error) => ApiError.BadRequest(`Ошибка при удалении категории`, error)
      )
      
      return res.status(200).json(product)
    } catch (e) {
      next(e)
    }
  }
  
  static async addSpecification(req: Request, res: Response, next: NextFunction) {
    try {
      const data = req.body
      
      const product = await controllerWrapper(
        async (transaction) => {
          return await productService.addSpecification(data, {transaction})
        },
        (error) => ApiError.BadRequest(`Ошибка при добавлении характеристики`, error)
      )
      
      return res.status(200).json(product)
    } catch (e) {
      next(e)
    }
  }
  
  static async destroySpecification(req: Request, res: Response, next: NextFunction) {
    try {
      const data = req.body
      
      const product = await controllerWrapper(
        async (transaction) => {
          return await productService.destroySpecification(data, {transaction})
        },
        (error) => ApiError.BadRequest(`Ошибка при удалении характеристики`, error)
      )
      
      return res.status(200).json(product)
    } catch (e) {
      next(e)
    }
  }
  
}

export {productController}