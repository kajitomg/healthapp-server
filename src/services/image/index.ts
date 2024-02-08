import {ApiError} from "../../exceptions/api-error";
import {MyTransactionType} from "../../helpers/transaction";
import {imageModel} from "../../models";
import {IImage} from "../../models/image/image-model";
import createSlice from "../../helpers/create-slice";
import destroyFile from "../../helpers/destroy-file";

const t: MyTransactionType = require('../../helpers/transaction')

class imageService {
  
  static create = createSlice<{
    item:IImage
  },Pick<IImage, 'path' | 'name'>>(async ({data, options}) => {
    const transaction = options?.transaction

    const result = await imageModel.create(data, {transaction: transaction.data})
    
    if (!result) {
      await t.rollback(transaction.data)
      throw ApiError.BadRequest(`Ошибка при добавлении изображения`)
    }
    
    return {item:result}
  })
  
  static get = createSlice<{
    item:IImage
  },{ id?: number, path?: string }>(async ({data, options}) => {
    const transaction = options?.transaction
    
    const result = await imageModel.findOne({where: data, transaction: transaction.data})
    
    if (!result) {
      await t.rollback(transaction.data)
      throw ApiError.BadRequest(`Ошибка при получении изображений`)
    }
    
    return {
      item:result
    }
  })
  
  static update = createSlice<{
    item:IImage
  },Pick<IImage, 'id' | 'name'>>(async({data, options}) => {
    const transaction = options?.transaction
    
    const image = await imageModel.findOne({where: {id:data.id}, transaction: transaction.data})
    
    await image.update(data,{transaction: transaction.data})
    
    if (!image) {
      await t.rollback(transaction.data)
      throw ApiError.BadRequest(`Ошибка при обновлении изображения`)
    }
    
    return {
      item:image
    }
  })
  
  static destroy = createSlice<number,Pick<IImage, 'id'>>(async ({data, options}) => {
    const transaction = options?.transaction
    
    const result = await imageModel.findOne({where: data, transaction: transaction.data})
    const destroyData = result.dataValues
    
    await result.destroy({transaction: transaction.data})
    
    if (!result) {
      await t.rollback(transaction.data)
      throw ApiError.BadRequest(`Ошибка при удалении изображения`)
    }
    
    destroyFile([destroyData])
    
    return 1
  })
  
  static destroys = createSlice<number,IImage[]>(async ({data, options}) => {
    const transaction = options?.transaction
    
    const images = await imageModel.findAll({
      where: {id: data.map((dat) => dat.dataValues.id)},
      transaction: transaction.data
    })
    
    destroyFile(images.map((image) => {
      return {path: image.dataValues.path}
    }))
    
    await imageModel.destroy({where: {id: images.map((image) => image.dataValues.id)}, transaction: transaction.data})
    
    return 1
  })
}

export {imageService}