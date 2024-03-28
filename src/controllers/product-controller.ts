import {ApiError} from "../exceptions/api-error";
import {DTOService} from "../services/dto";
import {productService} from "../services/product";
import {NextFunction, Request, Response} from "express";
import controllerWrapper from "../helpers/controller-wrapper";
import {createDTO} from "../helpers/create-dto";
import {IProduct} from "../models/product/product-model";


class productController {
  
  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const props = createDTO<IProduct, keyof Pick<IProduct, 'name' | 'imageId' | 'article' | 'description' | 'discount' | 'price'>>(req.body,['description','article','name','price','imageId','discount'])
      const queries = req.query
      
      const product = await controllerWrapper(
        async (transaction) => {
          return await productService.create({data:props,queries,options:{transaction}})
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
          return await productService.gets({queries, options:{transaction}})
        },
        (error) => ApiError.BadRequest(`Ошибка при получении продуктов`, error)
      )
      
      return res.status(200).json(products)
    } catch (e) {
      next(e)
    }
  }
  
  static async priceRange(req: Request, res: Response, next: NextFunction) {
    try {
      const queries = req.query
      
      const range = await controllerWrapper(
        async (transaction) => {
          return await productService.getPriceRange({queries, options:{transaction}})
        },
        (error) => ApiError.BadRequest(`Ошибка при получении диапазона цен`, error)
      )
      
      return res.status(200).json(range)
    } catch (e) {
      next(e)
    }
  }
  
  static async get(req: Request, res: Response, next: NextFunction) {
    try {
      const queries = req.query
      const params = req.params
      
      const products = await controllerWrapper(
        async (transaction) => {
          return await productService.get({data: params,queries:queries, options:{transaction}})
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
      const props = createDTO<IProduct, keyof Pick<IProduct, 'id' | 'name' | 'price' | 'discount' | 'article' | 'count' | 'description'>>(req.body,['id', 'name', 'price', 'discount', 'article', 'description', 'count'])

      const product = await controllerWrapper(
        async (transaction) => {
          return await productService.update({data:props,options:{transaction}})
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
      const props = createDTO<IProduct, keyof Pick<IProduct,'id'>>(req.body,['id'])
      const queries = req.query
      
      const product = await controllerWrapper(
        async (transaction) => {
          return await productService.destroy({data:props,queries, options:{transaction}})
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
      const props = createDTO<IProduct, keyof Pick<IProduct,'id'>>(req.body,['id'])
      
      const product = await controllerWrapper(
        async (transaction) => {
          return await productService.images({data:props, options:{transaction}})
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
      const props = createDTO<IProduct, keyof Pick<IProduct,'id'>>(req.body,['id'])
      
      const product = await controllerWrapper(
        async (transaction) => {
          return await productService.documents({data:props, options:{transaction}})
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
      const props = createDTO<IProduct, keyof Pick<IProduct,'id'>>(req.body,['id'])
      
      const product = await controllerWrapper(
        async (transaction) => {
          return await productService.categories({data:props, options:{transaction}})
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
      const props = createDTO<IProduct, keyof Pick<IProduct,'id'>>(req.body,['id'])
      
      const product = await controllerWrapper(
        async (transaction) => {
          return await productService.specifications({data:props, options:{transaction}})
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
      const {productId, imageId} = req.body
      
      const product = await controllerWrapper(
        async (transaction) => {
          return await productService.addImage({data: {productId,imageId}, options:{transaction}})
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
      const {productId, imageId} = req.body
      
      const product = await controllerWrapper(
        async (transaction) => {
          return await productService.destroyImage({data: {imageId,productId}, options:{transaction}})
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
      const {productId, documentId} = req.body
      
      const product = await controllerWrapper(
        async (transaction) => {
          return await productService.addDocument({data: {documentId,productId}, options:{transaction}})
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
      const {productId, documentId} = req.body
      
      const product = await controllerWrapper(
        async (transaction) => {
          return await productService.destroyDocument({data: {productId,documentId}, options:{transaction}})
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
      const {productId, categoryId} = req.body
      
      const product = await controllerWrapper(
        async (transaction) => {
          return await productService.addCategory({data: {categoryId,productId}, options:{transaction}})
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
      const {productId, categoryId} = req.body
      
      const product = await controllerWrapper(
        async (transaction) => {
          return await productService.destroyCategory({data: {productId,categoryId}, options:{transaction}})
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
      const {productId, specificationId, valueId} = req.body
      
      const product = await controllerWrapper(
        async (transaction) => {
          return await productService.addSpecification({data: {specificationId,productId,valueId}, options:{transaction}})
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
      const {productId, specificationId, valueId} = req.body
      
      const product = await controllerWrapper(
        async (transaction) => {
          return await productService.destroySpecification({data: {specificationId,productId,valueId}, options:{transaction}})
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