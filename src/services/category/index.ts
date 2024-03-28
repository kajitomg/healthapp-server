import {ApiError} from "../../exceptions/api-error";
import {categoryModel, imageModel} from "../../models";
import {ICategory} from "../../models/product/category-model";
import queriesNormalize from "../../helpers/queries-normalize";
import createSlice from "../../helpers/create-slice";
import {levelModel} from "../../models/product/level-model";


class categoryService {
  
  static create = createSlice<{
    item:ICategory,
    count:number
  },Pick<ICategory, 'name' | 'levelId'>>(async ({data,queries, options}) => {
    const transaction = options?.transaction
    if(!data.levelId){
      data.levelId = 1
    }
    const result = await categoryModel.create(data, {transaction: transaction.data})
    
    const {count} = await this.count({queries, options:{transaction}})
    
    if (!result || !count) {
      throw ApiError.BadRequest(`Ошибка при создании категории`)
    }
    
    return {
      item:result,
      count
    }
  })
  
  static get = createSlice<{
    item:ICategory
  },{ id?: number, name?: string }>(async ({data, queries, options}) => {
    const transaction = options?.transaction
    const normalizeQueries = queriesNormalize(queries)
    
    const result = await categoryModel.findOne({
      ...(data && {where: data}),
      include:normalizeQueries.include,
      transaction: transaction.data
    })
    if (!result) {
      throw ApiError.BadRequest(`Ошибка при получении категории`)
    }
    
    return {
      item:result
    }
  })
  
  static gets = createSlice<{
    list: ICategory[],
    count: number
  }>(async ({queries, options}) => {
    const transaction = options?.transaction
    const normalizeQueries = queriesNormalize(queries)
    
    const categories = await categoryModel.findAndCountAll({
      where: {
        ...normalizeQueries.searched,
        ...(queries?.levelId && {levelId:queries?.levelId}),
      },
      include: normalizeQueries.include,
      distinct:true,
      offset: normalizeQueries.offset,
      limit: normalizeQueries.limit,
      order: normalizeQueries.order,
      transaction: transaction.data
    })
    
    const result = {
      list:categories.rows,
      count:categories.count
    }
    if (!result) {
      throw ApiError.BadRequest(`Ошибка при получении категории`)
    }
    
    return result
  })
  
  static update = createSlice<{
    item:ICategory
  },Pick<ICategory, 'id' | 'name'>>(async ({data, options}) => {
    const transaction = options?.transaction
    
    const result = await categoryModel.findOne({where: {id:data.id}, transaction: transaction.data})
    
    await result.update(data,{transaction: transaction.data})
    
    if (!result) {
      throw ApiError.BadRequest(`Ошибка при обновлении категории`)
    }
    
    return {
      item: result
    }
  })
  
  static addChildren = createSlice<{
    count:number
  }, { parentId:number,childrenId:number }>(async ({data,queries,options}) => {
    const transaction = options?.transaction
    console.log(data)
    const categoryParent = await categoryModel.findOne({where: {id:data.parentId}, transaction: transaction.data})
    const categoryChildren = await categoryModel.findOne({where: {id:data.childrenId}, transaction: transaction.data})
    
    if(categoryChildren.dataValues.levelId <= categoryParent.dataValues.levelId){
      throw ApiError.BadRequest(`Уровень children выше или равно parent`)
    }

    await categoryParent.addChildren(categoryChildren,{through: {selfGranted: false}})
    
    const {count} = await this.count({queries, options:{transaction}})
    
    return {count}
  })
  
  
  static destroy = createSlice<{
    count:number
  },Pick<ICategory, 'id'>>(async ({data,queries, options}) => {
    const transaction = options?.transaction
    
    await categoryModel.destroy({where: {id: data.id}, transaction: transaction.data})
    
    const {count} = await this.count({queries, options:{transaction}})
    
    return {
      count
    }
  })
  
  static destroys = createSlice<{
    count:number
  },{items:ICategory[]}>(async ({data, queries, options}) => {
    const transaction = options?.transaction
    
    const categories = await imageModel.destroy({
      where: {id: data.items.map((category) => category.dataValues.id)},
      transaction: transaction.data
    })
    const {count} = await this.count({queries, options:{transaction}})
    
    if (!categories) {
      throw ApiError.BadRequest(`Ошибка при удалении изображений`)
    }
    
    return {
      count
    }
  })
  
  static count = createSlice<{
    count: number
  }>(async ({queries, options}) => {
    const transaction = options?.transaction
    const normalizeQueries = queriesNormalize(queries)
    
    const count = await categoryModel.count({
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

export {categoryService}