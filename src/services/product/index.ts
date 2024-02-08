import {ApiError} from "../../exceptions/api-error";
import {MyTransactionType} from "../../helpers/transaction";
import {
  categoryModel,
  documentModel,
  imageModel,
  productModel,
  specificationModel,
  typeModel,
} from "../../models";
import {IProduct} from "../../models/product/product-model";
import {imageService} from "../image";
import {documentService} from "../document";
import queriesNormalize from "../../helpers/queries-normalize";
import {categoryService} from "../category";
import {specificationService} from "../specification";
import {valueService} from "../value";
import createSlice from "../../helpers/create-slice";

const t: MyTransactionType = require('../../helpers/transaction')

class productService {
  
  static create = createSlice<{
    item:IProduct,
    count:number
  },Pick<IProduct,'name' | 'description' | 'imageId' | 'article' | 'discount' | 'price'>>(async ({data, queries, options}) => {
    const transaction = options?.transaction
    
    const product = await productModel.create(data, {transaction: transaction.data})
    
    const {count} = await this.count({queries, options:{transaction}})
    
    if (!product || !count) {
      await t.rollback(transaction.data)
      throw ApiError.BadRequest(`Ошибка при создании продукта`)
    }
    
    return {
      item:product,
      count
    }
  })
  
  static get = createSlice<{
    item:IProduct
  },Pick<IProduct, 'id' | 'name'>>(async ({data, options}) => {
    const transaction = options?.transaction

    const result = await productModel.findOne({
      where:data,
      include:
        [imageModel, documentModel, specificationModel, categoryModel],
      transaction: transaction.data}
    )
    
    if (!result) {
      await t.rollback(transaction.data)
      throw ApiError.BadRequest(`Ошибка при получении продукта`)
    }
    
    return {item:result}
  })
  
  static gets = createSlice<{
    list: IProduct[],
    count: number
  }>(async ({queries, options}) => {
    const transaction = options?.transaction
    const normalizeQueries = queriesNormalize(queries)

    const products = await productModel.findAll({
      where: {
        ...normalizeQueries.searched
      },
      raw: false,
      include:
        [imageModel, documentModel, specificationModel, categoryModel],
      offset: normalizeQueries.offset,
      limit: normalizeQueries.limit,
      order: normalizeQueries.order,
      transaction: transaction.data
    })
    console.log(products)
    
    const {count} = await this.count({queries, options:{transaction}})
    
    const result = {
      list:products,
      count
    }
    if (!result) {
      await t.rollback(transaction.data)
      throw ApiError.BadRequest(`Ошибка при получении продуктов`)
    }
    
    return result
  })
  
  static update = createSlice<{
    item:IProduct
  },Pick<IProduct, 'id' | 'name' | 'price' | 'discount' | 'article' | 'description'>>(async ({data, options}) => {
    const transaction = options?.transaction
    
    const product = await productModel.findOne({where: {id:data.id}, transaction: transaction.data})
    
    await product.update(data,{transaction: transaction.data})
    
    const result = await this.get({data:{id:data.id},options:{transaction}})
    
    if (!product) {
      await t.rollback(transaction.data)
      throw ApiError.BadRequest(`Ошибка при обновлении продукта`)
    }
    
    return {item:result.item}
  })
  
  static destroy = createSlice<{
    count:number
  },Pick<IProduct, 'id'>>(async ({data,queries, options}) => {
    const transaction = options?.transaction
    
    const product = await productModel.findOne({
      where: {id: data.id},
      include:
        [imageModel, documentModel, specificationModel, categoryModel],
      transaction: transaction.data
    })
    
    await imageService.destroys({data:product.dataValues.images,options:{transaction}})
    await documentService.destroys({data:product.dataValues.documents,options:{transaction}})
    await specificationService.destroys({data:product.dataValues.specifications.filter((specification) => !specification.basic),options:{transaction}})
    await valueService.destroys({data:product.dataValues.values.filter((value) => !value.basic),options:{transaction}})

    await product.destroy({transaction: transaction.data})
    
    const {count} = await this.count({queries, options:{transaction}})
    
    return {count}
  })
  
  static images = createSlice<{
    item:IProduct
  },Pick<IProduct, 'id'>>(async ({data, options}) => {
    const transaction = options?.transaction
    
    const result = await productModel.findOne({where: data, include: imageModel, transaction: transaction.data})
    
    if (!result) {
      await t.rollback(transaction.data)
      throw ApiError.BadRequest(`Ошибка при получении изображений продукта`)
    }
    
    return {
      item:result
    }
  })
  
  static documents = createSlice<{
  item:IProduct
},Pick<IProduct, 'id'>>(async ({data, options}) => {
    const transaction = options?.transaction
    
    const result = await productModel.findOne({where: data, include: documentModel, transaction: transaction.data})
    
    if (!result) {
      await t.rollback(transaction.data)
      throw ApiError.BadRequest(`Ошибка при получении документов продукта`)
    }
    
    return {
      item:result
    }
  })
  
  static categories = createSlice<{
  item:IProduct
},Pick<IProduct, 'id'>>(async ({data, options}) => {
    const transaction = options?.transaction
    
    const result = await productModel.findOne({where: data, include: categoryModel, transaction: transaction.data})
    
    if (!result) {
      await t.rollback(transaction.data)
      throw ApiError.BadRequest(`Ошибка при получении категорий продукта`)
    }
    
    return {
      item:result
    }
  })
  
  static specifications = createSlice<{
  item:IProduct
},Pick<IProduct, 'id'>>(async ({data, options}) => {
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
    
    return {
      item:result
    }
  })
  
  static addImage = createSlice<{
    item:IProduct
  },{
    productId: number,
    imageId: number
  }>(async ({data, options}) => {
    const transaction = options?.transaction
    
    const product = await productModel.findOne({where: {id: data.productId}, transaction: transaction.data})
    const image = await imageService.get({data:{id: data.imageId},options:{transaction}})
    
    await product.addImage(image.item, {through: {selfGranted: false}})
    
    const result = await this.get({data:{id:data.productId},options:{transaction}})
    
    if (!image) {
      await t.rollback(transaction.data)
      throw ApiError.BadRequest(`Ошибка при добавлении изображения`)
    }
    
    return {item:result.item}
  })
  
  static destroyImage = createSlice<number,{
    productId: number,
    imageId: number
  }>(async ({data, options}) => {
    const transaction = options?.transaction
    
    const product = await productModel.findOne({where: {id: data.productId}, transaction: transaction.data})
    
    const image = await imageService.get({data:{id: data.imageId},options:{transaction}})
    
    await product.removeImage(image.item, {transaction: transaction.data})
    
    await imageService.destroy({data:{id: image.item.dataValues.id}, options:{transaction}})
    
    if (!product) {
      await t.rollback(transaction.data)
      throw ApiError.BadRequest(`Ошибка при удалении изображения`)
    }
    
    return 1
  })
  
  static addDocument = createSlice<{
    item:IProduct
  },{
    productId: number,
    documentId: number
  }>(async ({data, options}) => {
    const transaction = options?.transaction
    
    const product = await productModel.findOne({where: {id: data.productId}, transaction: transaction.data})
    const document = await documentService.get({data:{id: data.documentId}, options:{transaction}})
    
    await product.addDocument(document.item, {through: {selfGranted: false}})
    
    const result = await this.get({data:{id:data.productId},options:{transaction}})
    
    if (!document) {
      await t.rollback(transaction.data)
      throw ApiError.BadRequest(`Ошибка при добавлении документа`)
    }
    
    return {item:result.item}
  })
  
  static destroyDocument = createSlice<number,{
    productId: number,
    documentId: number
  }>(async ({data, options}) => {
    const transaction = options?.transaction
    
    const product = await productModel.findOne({where: {id: data.productId}, transaction: transaction.data})
    
    const document = await documentService.get({data:{id: data.documentId}, options:{transaction}})
    
    await product.removeDocument(document.item, {transaction: transaction.data})
    
    await documentService.destroy({data:{id: document.item.dataValues.id}, options:{transaction}})
    
    if (!product) {
      await t.rollback(transaction.data)
      throw ApiError.BadRequest(`Ошибка при удалении документа`)
    }
    
    return 1
  })
  
  static addCategory = createSlice<{
    item:IProduct
  },{
    productId: number,
    categoryId: number
  }>(async ({data, options}) => {
    const transaction = options?.transaction
    
    const product = await productModel.findOne({where: {id: data.productId}, transaction: transaction.data})
    const category = await categoryService.get({data:{id: data.categoryId}, options:{transaction}})
    
    await product.addCategory(category.item, {through: {selfGranted: false}})
    
    const result = await this.get({data:{id:data.productId},options:{transaction}})
    
    if (!category) {
      await t.rollback(transaction.data)
      throw ApiError.BadRequest(`Ошибка при добавлении категории`)
    }
    
    return {item:result.item}
  })
  
  static destroyCategory = createSlice<{
    item:IProduct
  },{
    productId: number,
    categoryId: number
  }>(async ({data, options}) => {
    const transaction = options?.transaction
    
    const product = await productModel.findOne({where: {id: data.productId}, transaction: transaction.data})
    
    const category = await categoryService.get({data:{id: data.categoryId}, options:{transaction}})
    
    await product.removeCategory(category.item, {transaction: transaction.data})
    
    const result = await this.get({data:{id:data.productId},options:{transaction}})
    
    if (!product) {
      await t.rollback(transaction.data)
      throw ApiError.BadRequest(`Ошибка при удалении категории`)
    }
    
    return {item:result.item}
  })
  
  static addSpecification = createSlice<{
    item:IProduct
  },{
    productId: number,
    specificationId: number,
    valueId: number
  }>(async ({data, options}) => {
    const transaction = options?.transaction
    const product = await productModel.findOne({where: {id: data.productId}, transaction: transaction.data})
    const specification = await specificationService.get({data:{id: data.specificationId}, options:{transaction}})
    const value = await valueService.get({data:{id: data.valueId}, options:{transaction}})
    await product.addSpecification(specification.item, { through: { value:value.item.dataValues.value }})
    
    const result = await this.get({data:{id:data.productId},options:{transaction}})
    
    if (!specification || !value) {
      await t.rollback(transaction.data)
      throw ApiError.BadRequest(`Ошибка при добавлении характеристики`)
    }
    
    return {item:result.item}
  })
  
  static destroySpecification = createSlice<{
    item:IProduct
  },{
    productId: number,
    specificationId: number,
    valueId: number
  }>(async ({data, options}) => {
    const transaction = options?.transaction
    
    const product = await productModel.findOne({where: {id: data.productId}, transaction: transaction.data})
    
    const specification = await specificationService.get({data:{id: data.specificationId}, options:{transaction}})
    const value = await valueService.get({data:{id: data.valueId}, options:{transaction}})
    
    await product.removeSpecification(specification.item, {transaction: transaction.data})
    await product.removeType(value.item, {transaction: transaction.data})
    
    const result = await this.get({data:{id:data.productId},options:{transaction}})
    
    if (!product) {
      await t.rollback(transaction.data)
      throw ApiError.BadRequest(`Ошибка при удалении характеристики`)
    }
    
    return {item:result.item}
  })
  
  static count = createSlice<{ count: number }>(async ({queries, options}) => {
    const transaction = options?.transaction
    const normalizeQueries = queriesNormalize(queries)
    
    const count = await productModel.count({
      where: {
        ...normalizeQueries.searched
      },
      raw: true,
      transaction: transaction.data,
      order: normalizeQueries.order
    })
    
    return {
      count
    }
  })
  
}

export {productService}