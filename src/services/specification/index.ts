import {ApiError} from "../../exceptions/api-error";
import {MyTransactionType, TransactionOptionsType} from "../../helpers/transaction";
import {
  categoryModel,
  productModel,
  specificationModel,
  typeModel,
  userModel,
  valueModel
} from "../../models";
import {SpecificationI} from "../../models/product/specification-model";
import {valueService} from "../value";
import {ProductI} from "../../models/product/product-model";
import queriesNormalize from "../../helpers/queries-normalize";

const t: MyTransactionType = require('../../helpers/transaction')

class specificationService {
  
  static async create(data: {
    name?: string,
    basic?: boolean,
    typeId?: number,
    categoryId?: number
  }, options?: TransactionOptionsType): Promise<SpecificationI> {
    const transaction = options?.transaction
    
    const type = data.typeId && typeModel.findOne({where: {id: data.typeId}})
    if (!type) {
      delete data.typeId
    }
    const category = data.categoryId && categoryModel.findOne({where: {id: data.categoryId}})
    if (!category) {
      delete data.categoryId
    }
    
    const specification = await specificationModel.create(data, {transaction: transaction.data})
    
    if (!specification) {
      await t.rollback(transaction.data)
      throw ApiError.BadRequest(`Ошибка при создании характеристики`)
    }
    
    return specification
    
  }
  
  static async get(data: {
    id?: number,
    name?: string,
    typeId?: number,
    categoryId?: number
  }, options?: TransactionOptionsType): Promise<SpecificationI> {
    const transaction = options?.transaction
    
    const result = specificationModel.findAll({where: data, transaction: transaction.data})
    
    if (!result) {
      await t.rollback(transaction.data)
      throw ApiError.BadRequest(`Ошибка при получении характеристики`)
    }
    
    return result
    
  }
  
  static async gets(queries: any, options?: TransactionOptionsType): Promise<{
    specifications: ProductI[],
    count: number
  }> {
    const transaction = options?.transaction
    const normalizeQueries = queriesNormalize(queries)
    
    const specifications = await productModel.findAll({
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
      specifications,
      count
    }
    if (!result) {
      await t.rollback(transaction.data)
      throw ApiError.BadRequest(`Ошибка при получении характеристик`)
    }
    
    return result
  }
  
  static async update(data: {
    id: number,
    name?: string,
    typeId?: number,
    categoryId?: number
  }, options?: TransactionOptionsType): Promise<SpecificationI> {
    const transaction = options?.transaction
    
    const type = typeModel.findOne({where: {id: data.typeId}})
    if (!type) {
      delete data.typeId
    }
    const category = categoryModel.findOne({where: {id: data.categoryId}})
    if (!category) {
      delete data.categoryId
    }
    
    const specification = await specificationModel.update(data, {where: {id: data.id}, transaction: transaction.data})
    
    if (!specification) {
      await t.rollback(transaction.data)
      throw ApiError.BadRequest(`Ошибка при обновлении характеристики`)
    }
    
    return specification
    
  }
  
  static async addValue(data: {
    specificationId: number,
    valueId: number
  }, options?: TransactionOptionsType): Promise<SpecificationI> {
    const transaction = options?.transaction
    
    const specification = specificationModel.findOne({where: {id: data.specificationId}, transaction: transaction.data})
    const value = await valueService.get({id: data.valueId}, {transaction})
    
    await specification.addValue(value, {through: {selfGranted: false}})
    
    if (!specification) {
      await t.rollback(transaction.data)
      throw ApiError.BadRequest(`Ошибка при добавлении значения характеристике`)
    }
    
    return specification
  }
  
  static async destroyValue(data: {
    specificationId: number,
    valueId: number
  }, options?: TransactionOptionsType): Promise<SpecificationI> {
    const transaction = options?.transaction
    
    const specification = specificationModel.findOne({where: {id: data.specificationId}, transaction: transaction.data})
    const value = await valueService.get({id: data.valueId}, {transaction})
    
    await specification.removeValue(value, {through: {selfGranted: false}})
    
    if (!specification) {
      await t.rollback(transaction.data)
      throw ApiError.BadRequest(`Ошибка при добавлении значения характеристике`)
    }
    
    return specification
  }
  
  
  static async destroy(data?: { specificationId: number }, options?: TransactionOptionsType): Promise<number> {
    const transaction = options?.transaction
    
    const specification = await productModel.findOne({
      where: {id: data.specificationId},
      include: [valueModel],
      transaction: transaction.data
    })
    
    await valueService.destroys(specification.dataValues.values.filter((value) => !value.basic), {transaction})
    
    await specification.destroy({transaction: transaction.data})
    
    return 1
    
  }
  
  static async destroys(data?: any[], options?: TransactionOptionsType): Promise<number> {
    const transaction = options?.transaction
    
    await specificationModel.destroy({
      where: {id: data.map((value) => value.dataValues.id)},
      transaction: transaction.data
    })
    
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

export {specificationService}