import createSlice from "../../helpers/create-slice";
import {cartModel, ICart} from "../../models/cart/cart-model";
import {ApiError} from "../../exceptions/api-error";
import {IProduct} from "../../models/product/product-model";
import queriesNormalize from "../../helpers/queries-normalize";
import {cartProductModel} from "../../models/cart/cart-product-model";

class cartService {
  
  static create = createSlice<{
    item:ICart
  },{userId?:number}>(async ({data,options}) => {
    const transaction = options?.transaction
    
    const item = await cartModel.create(data, {transaction: transaction.data})
    
    if (!item) {
      throw ApiError.BadRequest(`Ошибка при создании корзины`)
    }
    
    return {
      item
    }
  })
  
  static get = createSlice<{
    item:ICart
  },{id?:number,userId?:number}>(async ({data, queries,options}) => {
    const transaction = options?.transaction
    const normalizeQueries = queriesNormalize(queries)

    const item = await cartModel.findOne({
      where:data,
      transaction: transaction.data,
      include: normalizeQueries.include,
      order:[['createdAt','ASC']]
    })
    
    if (!item) {
      throw ApiError.BadRequest(`Ошибка при получении корзины`)
    }
    
    return {
      item
    }
  })
  
  static put = createSlice(async () => {
  
  })
  
  static addProducts = createSlice<{
    item:ICart
  },{id?:number,products:IProduct[]}>(async ({data,options}) => {
    const transaction = options?.transaction

    const {item} = await this.get({data:{id:data.id},options:{transaction: transaction}})

    const list = data.products.map((product) => {
      return {productId:product.id,cartId:item.id,count:product?.['cart-products']?.[0]?.count || 1}
    })
    
    
    await cartProductModel.bulkCreate(list, {ignoreDuplicates:true,transaction:transaction.data})
    
    const {item:result} = await this.get({data:{id:data.id},options:{transaction: transaction}})
    
    if (!result) {
      throw ApiError.BadRequest(`Ошибка при добавлении продуктов в корзину`)
    }

    return {
      item:result
    }
  })
  
  static deleteProducts = createSlice<{
    item:Partial<ICart>
  },{id?:number,products:IProduct[]}>(async ({data,options}) => {
    const transaction = options?.transaction

    const {item} = await this.get({data:{id:data.id},options:{transaction: transaction}})
    
    const list = data.products?.map((product) => {
      return product.id
    })
    
    await cartProductModel.destroy({where: {productId:list,cartId:data.id},transaction:transaction.data})
    
    if (!item) {
      throw ApiError.BadRequest(`Ошибка при удалении продуктов из корзины`)
    }
    
    return {
      item:{}
    }
  })
  
  static incrementProduct = createSlice<{
    item:ICart
  },{id?:number,product:IProduct}>(async ({data,options}) => {
    const transaction = options?.transaction

    const {item} = await this.get({data:{id:data.id},options:{transaction: transaction}})
    
    await cartProductModel.increment('count', {where:{productId:data.product.id,cartId:item.id},transaction:transaction.data})
    
    if (!item) {
      throw ApiError.BadRequest(`Ошибка при увеличении количества продуктов в корзине`)
    }
    
    return {
      item
    }
  })
  
  static decrementProduct = createSlice<{
    item:Partial<ICart>
  },{id?:number,product:IProduct}>(async ({data,options}) => {
    const transaction = options?.transaction

    const {item} = await this.get({data:{id:data.id},options:{transaction: transaction}})
  
    await cartProductModel.decrement('count', {where:{productId:data.product.id,cartId:item.id},transaction:transaction.data})
    
    const cartProduct = await cartProductModel.findOne({where:{productId:data.product.id,cartId:item.id},transaction:transaction.data})

    if(cartProduct.count === 0){
      await this.deleteProducts({data:{id:item.id,products:[data.product]},options:{transaction}})
    }
    
    
    if (!item) {
      throw ApiError.BadRequest(`Ошибка при уменьшении количества продуктов в корзине`)
    }
    
    return {
      item
    }
  })
  
  static delete = createSlice(async () => {
  
  })
  
  static count = createSlice(async () => {
  
  })
  
}

export {cartService}