import {col, fn, Op} from "sequelize"
import {DBService} from "../services/db"
import models from "../models";

export enum DBModels {
  'category' = 'categoryModel',
  'type' = 'typeModel',
  'specification' = 'specificationModel',
  'product' = 'productModel',
  'image' = 'imageModel',
  'document' = 'documentModel',
  'level' = 'levelModel',
  'status' = 'statusModel',
  'cart-product' = 'cartProductModel',
  'like-product' = 'likeProductModel',
  'product-specification' = 'productSpecificationModel',
  'cart' = 'cartModel',
}

export const filterConditions = {
  price: Op.between,
  brand: Op.or,
  count: Op.gte,
}

export const searchConditions = {
  and: Op.and,
  or: Op.or,
}

export default function queriesNormalize(queries) {
  const sequelize = DBService.postgres.sequelize
  const include = []
  
  const offset = queries?.page ? queries?.page * queries?.limit - queries?.limit: undefined
  const limit = queries?.limit ? queries?.limit : undefined

  const order = queries?.sort ?
      (Object.entries(JSON.parse(queries?.sort))[0][0] === 'price' ? [[
        fn(
          'COALESCE',
          col('discount'), // Первый аргумент - discount
          col('price'),    // Второй аргумент - price
          ...(Object.entries(JSON.parse(queries?.sort))[0][1] === 'DESC' ? [0] :[])
        ),
        Object.entries(JSON.parse(queries?.sort))[0][1]
      ]] : JSON.parse(queries?.sort)?.[0] ? [JSON.parse(queries?.sort)] :[])
  : []
  const searched = {}
  const data = {}
  const filter = {}

  if (!queries?.search && !queries?.data && !queries?.include && !queries?.filter) {
    return {searched, data, filter, offset, limit, order, include}
  }

  if(queries?.data){
    const dataKeys = Object.keys(JSON.parse(queries?.data))
    dataKeys.map(key => {
      data[key] = JSON.parse(queries?.data)[key]
    })
  }
  
  if(queries?.filter){
    const filterObj = JSON.parse(queries?.filter)
    const filterKeys = Object.keys(filterObj)
    filterKeys.map(key => {
      if(key === 'price'){
        filter[Op.or] = [
          {
            discount: {
              [filterConditions[key]]: filterObj[key]
            }
          },
          {
            [Op.and]: [
              {discount:null},
              {[key]: {
                [filterConditions[key]]: filterObj[key]
              }}
            ]
            
          },
        ]
        return
      }
      filter[key] = {[filterConditions[key]]:filterObj[key]}
    })
  }
  
  if(queries?.include){
    const includeKeys =  Object.keys(queries.include)
    includeKeys.map((includeKey) => {
      const where = queries?.where?.[includeKey]
      const order = queries?.sort && JSON.parse(queries?.sort)?.[includeKey]
      
      include.push({
        model:models[DBModels[includeKey]],
        ...(queries.include[includeKey] && {as:queries.include[includeKey]}),
        ...(where && {where}),
        ...(order && {order})
      })
    })
  }
  if(queries?.search){
    const search = typeof queries?.search === 'string' ? JSON.parse(queries?.search) : queries?.search
    console.log(search)
    const searchKeys = Object.keys(search)
    const and = []
    const or = []
    searchKeys.map(key => {
      if(key === 'or'){
        const searchKeys = Object.keys(queries?.search[key])
        const search = queries?.search[key]
        searchKeys.map(key => {
          or.push({[key]:{[Op.like]: `%${search[key]}%`}})
        })
      }else if(key === 'and'){
        const searchKeys = Object.keys(queries?.search[key])
        const search = queries?.search[key]
        searchKeys.map(key => {
          and.push({[key]:{[Op.like]: `%${search[key]}%`}})
        })
      } else {
        searched[key] = {[Op.like]: `%${search[key]}%`}
      }
      /*if (key === 'id') {
        searched[key] = {
          [Op.or]: [
            sequelize.where(
              sequelize.cast(sequelize.col('user.id'), 'varchar'),
              {[Op.like]: `%${queries?.search[key]}%`},
            ),
          ]
        }
      }*/
    })
    if(and.length){
      searched[searchConditions['and']] = and
    }
    if(or.length){
      searched[searchConditions['or']] = or
    }
  }
  
  return {searched, data, offset, limit, order, include , filter}
}