import {ApiError} from "../../exceptions/api-error";
import {IProduct, productModel} from "../../models/product/product-model";
import {imageService} from "../image";
import {documentService} from "../document";
import queriesNormalize from "../../helpers/queries-normalize";
import {categoryService} from "../category";
import {specificationService} from "../specification";
import {valueService} from "../value";
import createSlice from "../../helpers/create-slice";
import {col, fn, Op} from "sequelize";
import {imageModel} from "../../models/image/image-model";
import {documentModel} from "../../models/document/document-model";
import {specificationModel} from "../../models/product/specification-model";
import {categoryModel} from "../../models/product/category-model";
import {typeModel} from "../../models/product/type-model";
import {productImageModel} from "../../models/product/product-image-model";
import {productDocumentModel} from "../../models/product/product-document-model";
import {productCategoryModel} from "../../models/product/product-category-model";
import {productSpecificationModel} from "../../models/product/product-specification-model";
import {specificationValueModel} from "../../models/product/specification-value-model";


class productService {
  
  static create = createSlice<{
    item:IProduct,
    count:number
  },Pick<IProduct,'name' | 'description' | 'imageId' | 'article' | 'discount' | 'price'>>(async ({data, queries, options}) => {
    const transaction = options?.transaction
    
    const product = await productModel.create(data, {transaction: transaction.data})
    
    const {count} = await this.count({queries, options:{transaction}})
    
    if (!product || !count) {
      throw ApiError.BadRequest(`Ошибка при создании продукта`)
    }
    
    return {
      item:product,
      count
    }
  })
  
  static get = createSlice<{
    item:IProduct
  },Pick<IProduct, 'id' | 'name'>>(async ({data,queries, options}) => {
    const transaction = options?.transaction
    const normalizeQueries = queriesNormalize(queries)

    const result = await productModel.findOne({
      where:data,
      include:normalizeQueries.include,
      transaction: transaction.data}
    )

    if (!result) {
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
    console.log(queries,normalizeQueries)
    const products = await productModel.findAndCountAll({
      where: {
        ...normalizeQueries.searched,
        ...normalizeQueries.filter,
        ...normalizeQueries.data
      },
      distinct:true,
      raw: false,
      include: normalizeQueries.include,
      offset: normalizeQueries.offset,
      limit: normalizeQueries.limit,
      order: normalizeQueries.order,
      transaction: transaction.data
    })

    const result = {
      list:products.rows,
      count:products.count
    }
    if (!result) {
      throw ApiError.BadRequest(`Ошибка при получении продуктов`)
    }
    
    return result
  })
  
  static getPriceRange = createSlice<{
    item: {
      min:number,
      max:number
    }
  }>(async ({queries, options}) => {
    const transaction = options?.transaction
    const normalizeQueries = queriesNormalize(queries)

    const minPrice = await productModel.findOne({
      include: normalizeQueries.include,
      order: [
        [fn('COALESCE', col('discount'), col('price')), 'ASC']
      ],
      where: {
        ...normalizeQueries.searched,
        ...normalizeQueries.filter,
        ...normalizeQueries.data,
        [Op.or]: [
          { 'discount': { [Op.not]: null } },
          { 'price': { [Op.not]: null } }
        ]
      },
      attributes:['price','discount'],
      transaction: transaction.data,
    })
    const maxPrice = await productModel.findOne({
      include: normalizeQueries.include,
      order: [
        [fn('COALESCE', col('discount'), col('price')), 'DESC']
      ],
      where: {
        ...normalizeQueries.searched,
        ...normalizeQueries.filter,
        ...normalizeQueries.data,
        [Op.or]: [
          { 'discount': { [Op.not]: null } },
          { 'price': { [Op.not]: null } }
        ]
      },
      attributes:['price','discount'],
      transaction: transaction.data,
    })
    const result = {
      item:{
        min:+(await minPrice?.dataValues?.discount || await minPrice?.dataValues?.price) || 0,
        max:+(await maxPrice?.dataValues?.discount || await maxPrice?.dataValues?.price) || 0
      }
    }
    if (!result) {
      throw ApiError.BadRequest(`Ошибка при получении диапазона цен`)
    }
    
    return result
  })
  
  static update = createSlice<{
    item:IProduct
  },Pick<IProduct, 'id' | 'name' | 'price' | 'discount' | 'article' | 'count' | 'description'>>(async ({data, options}) => {
    const transaction = options?.transaction
    const product = await productModel.findOne({where: {id:data.id}, transaction: transaction.data})
    
    await product.update(data,{transaction: transaction.data})
    
    const result = await this.get({data:{id:data.id},options:{transaction}})
    
    if (!product) {
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
    await documentService.destroys({data:{items:product.dataValues.documents},options:{transaction}})
    await specificationService.destroys({data:{items:product.dataValues.specifications.filter((specification) => !specification.basic)},options:{transaction}})
    await valueService.destroys({data:{items:product.dataValues.values.filter((value) => !value.basic)},options:{transaction}})

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
    
    await productImageModel.create({productId:product.id,imageId:image.item.id},{transaction: transaction.data})
    
    const result = await this.get({data:{id:data.productId},options:{transaction}})
    
    if (!image) {
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
    
    await productImageModel.destroy({where:{productId:product.id,imageId:image.item.id}, transaction: transaction.data})
    
    await imageService.destroy({data:{id: image.item.dataValues.id}, options:{transaction}})
    
    if (!product) {
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
    
    await productDocumentModel.create({productId:product.id,documentId:document.item.id},{transaction: transaction.data})
    
    const result = await this.get({data:{id:data.productId},options:{transaction}})
    
    if (!document) {
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
    
    await productDocumentModel.destroy({where:{productId:product.id,documentId:document.item.id},transaction: transaction.data})
    
    await documentService.destroy({data:{id: document.item.dataValues.id}, options:{transaction}})
    
    if (!product) {
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
    
    await productCategoryModel.create({productId:product.id,categoryId:category.item.id},{transaction: transaction.data})
    
    const result = await this.get({data:{id:data.productId},options:{transaction}})
    
    if (!category) {
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
    
    await productCategoryModel.destroy({where:{productId:product.id,categoryId:category.item.id},transaction: transaction.data})
    
    const result = await this.get({data:{id:data.productId},options:{transaction}})
    
    if (!product) {
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
    
    await productSpecificationModel.create({productId:product.id,specificationId:specification.item.id},{transaction: transaction.data})
    
    const result = await this.get({data:{id:data.productId},options:{transaction}})
    
    if (!specification || !value) {
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
    
    await productSpecificationModel.destroy({where:{productId:product.id,specificationId:specification.item.id},transaction: transaction.data})
    await specificationValueModel.destroy({where:{specificationId:specification.item.id,valueId:value.item.id},transaction: transaction.data})
    
    
    const result = await this.get({data:{id:data.productId},options:{transaction}})
    
    if (!product) {
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
      transaction: transaction.data,
    })
    
    return {
      count
    }
  })
  
}

export {productService}