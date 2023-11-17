import {ApiError} from "../../exceptions/api-error";
import {MyTransactionType, TransactionOptionsType} from "../../helpers/transaction";
import {imageModel} from "../../models";
import {ImageI} from "../../models/image/image-model";
import destroyFile from "../../helpers/destroy-file";

const t: MyTransactionType = require('../../helpers/transaction')

class imageService {
  
  static async create(data?: { path: string }, options?: TransactionOptionsType): Promise<ImageI> {
    const transaction = options?.transaction
    
    const result = await imageModel.create(data, {transaction: transaction.data})
    
    if (!result) {
      await t.rollback(transaction.data)
      throw ApiError.BadRequest(`Ошибка при добавлении изображения`)
    }
    
    return result
  }
  
  static async get(data?: { id?: number, path?: string }, options?: TransactionOptionsType): Promise<ImageI> {
    const transaction = options?.transaction
    
    const result = await imageModel.findOne({where: data, transaction: transaction.data})
    
    if (!result) {
      await t.rollback(transaction.data)
      throw ApiError.BadRequest(`Ошибка при получении изображений`)
    }
    
    return result
  }
  
  static async destroy(data?: { id: number }, options?: TransactionOptionsType): Promise<number> {
    const transaction = options?.transaction
    
    const result = await imageModel.findOne({where: data, transaction: transaction.data})
    
    destroyFile([result.dataValues])
    
    await result.destroy({transaction: transaction.data})
    
    if (!result) {
      await t.rollback(transaction.data)
      throw ApiError.BadRequest(`Ошибка при удалении изображения`)
    }
    
    return 1
  }
  
  static async destroys(data?: any[], options?: TransactionOptionsType): Promise<number> {
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
  }
}

export {imageService}