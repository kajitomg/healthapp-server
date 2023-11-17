import {ApiError} from "../../exceptions/api-error";
import {MyTransactionType, TransactionOptionsType} from "../../helpers/transaction";
import {
  categoryModel,
  documentModel,
  imageModel,
  productModel,
  specificationModel,
  typeModel,
  userModel, valueModel
} from "../../models";
import {productDTO} from "../dto/product";
import {ProductI} from "../../models/product/product-model";
import {imageService} from "../image";
import {documentService} from "../document";
import {ImageI} from "../../models/image/image-model";
import {DocumentI} from "../../models/document/document-model";
import {CategoryI} from "../../models/product/category-model";
import queriesNormalize from "../../helpers/queries-normalize";
import {categoryService} from "../category";
import {specificationService} from "../specification";
import {typeService} from "../type";
import {valueService} from "../value";

const t: MyTransactionType = require('../../helpers/transaction')

class productService {
  
  static async create(data?: productDTO, options?: TransactionOptionsType): Promise<ProductI> {
    const transaction = options?.transaction
    
    const result = await productModel.create(data, {transaction: transaction.data})
    
    if (!result) {
      await t.rollback(transaction.data)
      throw ApiError.BadRequest(`Ошибка при создании продукта`)
    }
    
    return result
  }
  
  static async get(data: { id?: number, name?: string }, options?: TransactionOptionsType): Promise<CategoryI> {
    const transaction = options?.transaction
    
    const result = await productModel.findOne({where: data, transaction: transaction.data})
    
    if (!result) {
      await t.rollback(transaction.data)
      throw ApiError.BadRequest(`Ошибка при получении продукта`)
    }
    
    return result
  }
  
  static async gets(queries: any, options?: TransactionOptionsType): Promise<{ products: ProductI[], count: number }> {
    const transaction = options?.transaction
    const normalizeQueries = queriesNormalize(queries)
    
    const products = await productModel.findAll({
      where: {
        ...normalizeQueries.searched
      },
      raw: true,
      offset: normalizeQueries.offset,
      limit: normalizeQueries.limit,
      order: normalizeQueries.order,
      transaction: transaction.data
    })
    
    
    const {count} = await this.count(normalizeQueries, {transaction})
    
    const result = {
      products,
      count
    }
    if (!result) {
      await t.rollback(transaction.data)
      throw ApiError.BadRequest(`Ошибка при получении продуктов`)
    }
    
    return result
  }
  
  static async update(data: { id?: number, name?: string }, options?: TransactionOptionsType): Promise<CategoryI> {
    const transaction = options?.transaction
    
    const result = await productModel.update(data, {where: data, transaction: transaction.data})
    
    if (!result) {
      await t.rollback(transaction.data)
      throw ApiError.BadRequest(`Ошибка при обновлении продукта`)
    }
    
    return result
  }
  
  static async destroy(data?: { productId: number }, options?: TransactionOptionsType): Promise<number> {
    const transaction = options?.transaction
    
    const product = await productModel.findOne({
      where: {id: data.productId},
      include: [imageModel, documentModel, specificationModel, valueModel],
      transaction: transaction.data
    })
    
    await imageService.destroys(product.dataValues.images, {transaction})
    await documentService.destroys(product.dataValues.documents, {transaction})
    await specificationService.destroys(product.dataValues.specifications.filter((specification) => !specification.basic), {transaction})
    await valueService.destroys(product.dataValues.values.filter((value) => !value.basic), {transaction})
    
    await product.destroy({transaction: transaction.data})
    
    return 1
  }
  
  static async images(data: { id: number }, options?: TransactionOptionsType): Promise<ProductI> {
    const transaction = options?.transaction
    
    const result = await productModel.findOne({where: data, include: imageModel, transaction: transaction.data})
    
    if (!result) {
      await t.rollback(transaction.data)
      throw ApiError.BadRequest(`Ошибка при получении изображений продукта`)
    }
    
    return result
  }
  
  static async documents(data: { id?: number }, options?: TransactionOptionsType): Promise<ProductI> {
    const transaction = options?.transaction
    
    const result = await productModel.findOne({where: data, include: documentModel, transaction: transaction.data})
    
    if (!result) {
      await t.rollback(transaction.data)
      throw ApiError.BadRequest(`Ошибка при получении документов продукта`)
    }
    
    return result
  }
  
  static async categories(data: { id?: number }, options?: TransactionOptionsType): Promise<ProductI> {
    const transaction = options?.transaction
    
    const result = await productModel.findOne({where: data, include: categoryModel, transaction: transaction.data})
    
    if (!result) {
      await t.rollback(transaction.data)
      throw ApiError.BadRequest(`Ошибка при получении категорий продукта`)
    }
    
    return result
  }
  
  static async specifications(data: { id?: number }, options?: TransactionOptionsType): Promise<ProductI> {
    const transaction = options?.transaction
    
    const result = await productModel.findOne({
      where: data,
      include: [specificationModel, typeModel],
      transaction: transaction.data
    })
    
    if (!result) {
      await t.rollback(transaction.data)
      throw ApiError.BadRequest(`Ошибка при получении характеристик продукта`)
    }
    
    return result
  }
  
  static async addImage(data?: {
    productId: number,
    imageId: number
  }, options?: TransactionOptionsType): Promise<ImageI> {
    const transaction = options?.transaction
    
    const product = await productModel.findOne({where: {id: data.productId}, transaction: transaction.data})
    const image = await imageService.get({id: data.imageId}, {transaction})
    
    await product.addImage(image, {through: {selfGranted: false}})
    
    if (!image) {
      await t.rollback(transaction.data)
      throw ApiError.BadRequest(`Ошибка при добавлении изображения`)
    }
    
    return image
  }
  
  static async destroyImage(data?: {
    productId: number,
    id?: number,
    imageId: number
  }, options?: TransactionOptionsType): Promise<number> {
    const transaction = options?.transaction
    
    const product = await productModel.findOne({where: {id: data.productId}, transaction: transaction.data})
    
    const image = await imageService.get({id: data.imageId}, {transaction})
    
    await product.removeImage(image, {transaction: transaction.data})
    
    await imageService.destroy({id: image.dataValues.id}, {transaction})
    
    if (!product) {
      await t.rollback(transaction.data)
      throw ApiError.BadRequest(`Ошибка при удалении изображения`)
    }
    
    return 1
  }
  
  static async addDocument(data?: {
    productId: number,
    documentId: number
  }, options?: TransactionOptionsType): Promise<DocumentI> {
    const transaction = options?.transaction
    
    const product = await productModel.findOne({where: {id: data.productId}, transaction: transaction.data})
    const document = await documentService.get({id: data.documentId}, {transaction})
    
    await product.addDocument(document, {through: {selfGranted: false}})
    
    if (!document) {
      await t.rollback(transaction.data)
      throw ApiError.BadRequest(`Ошибка при добавлении документа`)
    }
    
    return document
  }
  
  static async destroyDocument(data?: {
    productId: number,
    documentId: number
  }, options?: TransactionOptionsType): Promise<number> {
    const transaction = options?.transaction
    
    const product = await productModel.findOne({where: {id: data.productId}, transaction: transaction.data})
    
    const document = await documentService.get({id: data.documentId}, {transaction})
    
    await product.removeDocument(document, {transaction: transaction.data})
    
    await documentService.destroy({id: document.dataValues.id}, {transaction})
    
    if (!product) {
      await t.rollback(transaction.data)
      throw ApiError.BadRequest(`Ошибка при удалении документа`)
    }
    
    return 1
  }
  
  static async addCategory(data?: {
    productId: number,
    categoryId: number
  }, options?: TransactionOptionsType): Promise<CategoryI> {
    const transaction = options?.transaction
    
    const product = await productModel.findOne({where: {id: data.productId}, transaction: transaction.data})
    const category = await categoryService.get({id: data.categoryId}, {transaction})
    
    await product.addCategory(category, {through: {selfGranted: false}})
    
    if (!category) {
      await t.rollback(transaction.data)
      throw ApiError.BadRequest(`Ошибка при добавлении категории`)
    }
    
    return category
  }
  
  static async destroyCategory(data?: {
    productId: number,
    categoryId: number
  }, options?: TransactionOptionsType): Promise<number> {
    const transaction = options?.transaction
    
    const product = await productModel.findOne({where: {id: data.productId}, transaction: transaction.data})
    
    const category = await categoryService.get({id: data.categoryId}, {transaction})
    
    await product.removeCategory(category, {transaction: transaction.data})
    
    if (!product) {
      await t.rollback(transaction.data)
      throw ApiError.BadRequest(`Ошибка при удалении категории`)
    }
    
    return 1
  }
  
  static async addSpecification(data?: {
    productId: number,
    specificationId: number,
    valueId: number
  }, options?: TransactionOptionsType): Promise<CategoryI> {
    const transaction = options?.transaction
    
    const product = await productModel.findOne({where: {id: data.productId}, transaction: transaction.data})
    const specification = await specificationService.get({id: data.specificationId}, {transaction})
    const value = await valueService.get({id: data.valueId}, {transaction})
    
    await product.addSpecification(specification, {through: {selfGranted: false}})
    await product.addValue(value, {through: {selfGranted: false}})
    
    if (!specification || !value) {
      await t.rollback(transaction.data)
      throw ApiError.BadRequest(`Ошибка при добавлении характеристики`)
    }
    
    return specification
  }
  
  static async destroySpecification(data?: {
    productId: number,
    specificationId: number,
    typeId: number
  }, options?: TransactionOptionsType): Promise<number> {
    const transaction = options?.transaction
    
    const product = await productModel.findOne({where: {id: data.productId}, transaction: transaction.data})
    
    const specification = await specificationService.get({id: data.specificationId}, {transaction})
    const type = await typeService.get({id: data.typeId}, {transaction})
    
    await product.removeSpecification(specification, {transaction: transaction.data})
    await product.removeType(type, {transaction: transaction.data})
    
    if (!product) {
      await t.rollback(transaction.data)
      throw ApiError.BadRequest(`Ошибка при удалении характеристики`)
    }
    
    return 1
  }
  
  static async count(queries: any, options?: TransactionOptionsType): Promise<{ count: number }> {
    const transaction = options?.transaction
    
    const count = await userModel.count({
      where: {
        ...queries.searched
      },
      raw: true,
      transaction: transaction.data,
      order: queries.order
    })
    
    return {
      count
    }
  }
  
}

export {productService}