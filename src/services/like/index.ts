import createSlice from "../../helpers/create-slice";
import {ApiError} from "../../exceptions/api-error";
import {IProduct} from "../../models/product/product-model";
import queriesNormalize from "../../helpers/queries-normalize";
import {imageModel, likeModel, likeProductModel, productModel} from "../../models";
import {ILike} from "../../models/like/like-model";




class likeService {
  
  static create = createSlice<{
    item:ILike
  },{userId?:number}>(async ({data,options}) => {
    const transaction = options?.transaction
    
    const item = await likeModel.create(data, {transaction: transaction.data})
    
    if (!item) {
      throw ApiError.BadRequest(`Ошибка при создании понравившегося`)
    }
    
    return {
      item
    }
  })
  
  static get = createSlice<{
    item:ILike
  },{id?:number,userId?:number}>(async ({data, queries,options}) => {
    const transaction = options?.transaction
    const normalizeQueries = queriesNormalize(queries)

    const item = await likeModel.findOne({
      where:data,
      transaction: transaction.data,
      include:normalizeQueries.include,
      order:[['createdAt','ASC']]
    })
    
    if (!item) {
      throw ApiError.BadRequest(`Ошибка при получении понравившегося`)
    }
    
    return {
      item
    }
  })
  
  static put = createSlice(async () => {
  
  })
  
  static addProducts = createSlice<{
    item:ILike
  },{id?:number,products:IProduct[]}>(async ({data,options}) => {
    const transaction = options?.transaction

    const {item} = await this.get({data:{id:data.id},options:{transaction: transaction}})
    
    const list = data.products.map((product) => {
      return {productId:product.id,likeId:item.id}
    })
    
    await likeProductModel.bulkCreate(list, {through: {selfGranted: false},ignoreDuplicates:true,transaction:transaction.data})
    
    const {item:result} = await this.get({data:{id:data.id},options:{transaction: transaction}})
    
    if (!result) {
      throw ApiError.BadRequest(`Ошибка при добавлении продуктов в понравившееся`)
    }
    
    return {
      item:result
    }
  })
  
  static deleteProducts = createSlice<{
    item:Partial<ILike>
  },{id?:number,products:IProduct[]}>(async ({data,options}) => {
    const transaction = options?.transaction
    
    const {item} = await this.get({data:{id:data.id},options:{transaction: transaction}})
    
    const list = data.products?.map((product) => {
      return product.id
    })
    
    await likeProductModel.destroy({where: {productId:list,likeId:data.id},through: {selfGranted: false},transaction:transaction.data})
    
    if (!item) {
      throw ApiError.BadRequest(`Ошибка при удалении продуктов из понравившегося`)
    }
    
    return {
      item:{}
    }
  })
  
  static delete = createSlice(async () => {
  
  })
  
  static count = createSlice(async () => {
  
  })
  
}

export {likeService}