import {ApiError} from "../../exceptions/api-error";
import {
  categoryModel,
  specificationModel,
  typeModel,
  valueModel
} from "../../models";
import {ISpecification} from "../../models/product/specification-model";
import {valueService} from "../value";
import queriesNormalize from "../../helpers/queries-normalize";
import createSlice from "../../helpers/create-slice";


class specificationService {
  
  static create = createSlice<{
    item:ISpecification,
    count:number
  },Pick<ISpecification, 'name'|'basic'|'typeId'|'categoryId'>>(async ({data,queries, options}) => {
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
    
    const {count} = await this.count({queries, options:{transaction}})
    
    if (!specification|| !count) {
      throw ApiError.BadRequest(`Ошибка при создании характеристики`)
    }
    
    return {
      item:specification,
      count
    }
  })
  
  static get = createSlice<{
    item:ISpecification
  },Pick<ISpecification, 'id'|'basic'|'typeId'|'categoryId'>>(async ({data, options}) => {
    const transaction = options?.transaction
    
    const result = await specificationModel.findOne({where: data, transaction: transaction.data})
    
    if (!result) {
      throw ApiError.BadRequest(`Ошибка при получении характеристики`)
    }
    
    return {
      item:result
    }
    
  })
  
  static gets = createSlice<{
    list: ISpecification[],
    count: number
  }>(async ({queries, options}) => {
    const transaction = options?.transaction
    const normalizeQueries = queriesNormalize(queries)

    const specifications = await specificationModel.findAll({
      where: {
        ...normalizeQueries.searched,
        ...normalizeQueries.filter,
        ...normalizeQueries.data
      },
      raw: false,
      include: normalizeQueries.include,
      offset: normalizeQueries.offset,
      limit: normalizeQueries.limit,
      order: normalizeQueries.order,
      transaction: transaction.data
    })
    
    
    const {count} = await this.count({queries, options:{transaction}})
    
    const result = {
      list:specifications,
      count
    }
    if (!result) {
      throw ApiError.BadRequest(`Ошибка при получении характеристик`)
    }
    
    return result
  })
  
  static update = createSlice<{
    item:ISpecification
  },Pick<ISpecification, 'id'|'name'| 'basic' |'typeId'|'categoryId'>>(async ({data, options}) => {
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
      throw ApiError.BadRequest(`Ошибка при обновлении характеристики`)
    }
    
    return {
      item:specification
    }
    
  })
  
  static addValue = createSlice<{
    item:ISpecification
  },{
    specificationId: number,
    valueId: number
  }>(async ({data, options}) => {
    const transaction = options?.transaction
    
    const specification = specificationModel.findOne({where: {id: data.specificationId}, transaction: transaction.data})
    const value = await valueService.get({data:{id: data.valueId}, options:{transaction}})
    
    await specification.addValue(value.item, {through: {selfGranted: false}})
    
    if (!specification) {
      throw ApiError.BadRequest(`Ошибка при добавлении значения характеристике`)
    }
    
    return {
      item:specification
    }
  })
  
  static destroyValue = createSlice<{
    item:ISpecification
  },{
    specificationId: number,
    valueId: number
  }>(async ({data, options}) => {
    const transaction = options?.transaction
    
    const specification = specificationModel.findOne({where: {id: data.specificationId}, transaction: transaction.data})
    const value = await valueService.get({data:{id: data.valueId}, options:{transaction}})
    
    await specification.removeValue(value.item, {through: {selfGranted: false}})
    
    if (!specification) {
      throw ApiError.BadRequest(`Ошибка при добавлении значения характеристике`)
    }
    
    return {
      item:specification
    }
  })
  
  
  static destroy = createSlice<{count:number},Pick<ISpecification, 'id'>>(async ({data, queries, options}) => {
    const transaction = options?.transaction
    
    const specification = await specificationModel.findOne({
      where: {id: data.id},
      include: [valueModel],
      transaction: transaction.data
    })
    
    await valueService.destroys({data:specification.dataValues.values.filter((value) => !value.basic), options:{transaction}})
    
    await specification.destroy({transaction: transaction.data})
    
    const {count} = await this.count({queries, options:{transaction}})
    
    return {count}
    
  })
  
  static destroys = createSlice<{count:number}, { items:ISpecification[] }>(async ({data, queries, options}) => {
    const transaction = options?.transaction
    
    await specificationModel.destroy({
      where: {id: data.items.map((value) => value.dataValues.id)},
      transaction: transaction.data
    })
    const {count} = await this.count({queries, options:{transaction}})
    
    return {
      count
    }
  })
  
  static count = createSlice<{
    count: number
  }>(async ({queries, options}) => {
    const transaction = options?.transaction
    const normalizeQueries = queriesNormalize(queries)
    
    const count = await specificationModel.count({
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

export {specificationService}