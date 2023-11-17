import {ApiError} from "../../exceptions/api-error";
import {MyTransactionType, TransactionOptionsType} from "../../helpers/transaction";
import {documentModel} from "../../models";
import {DocumentI} from "../../models/document/document-model";
import destroyFile from "../../helpers/destroy-file";

const t: MyTransactionType = require('../../helpers/transaction')

class documentService {
  
  static async create(data?: { path: string }, options?: TransactionOptionsType): Promise<DocumentI> {
    const transaction = options?.transaction
    
    const result = await documentModel.create(data, {transaction: transaction.data})
    
    if (!result) {
      await t.rollback(transaction.data)
      throw ApiError.BadRequest(`Ошибка при добавлении документа`)
    }
    
    return result
  }
  
  static async get(data: { id?: number, path?: string }, options?: TransactionOptionsType): Promise<DocumentI> {
    const transaction = options?.transaction
    
    const result = await documentModel.findOne({where: data, transaction: transaction.data})
    
    if (!result) {
      await t.rollback(transaction.data)
      throw ApiError.BadRequest(`Ошибка при получении документа`)
    }
    
    return result
  }
  
  static async destroy(data?: { id: number }, options?: TransactionOptionsType): Promise<number> {
    const transaction = options?.transaction
    
    const result = await documentModel.findOne({where: data, transaction: transaction.data})
    
    destroyFile([result.dataValues])
    
    await result.destroy({transaction: transaction.data})
    
    if (!result) {
      await t.rollback(transaction.data)
      throw ApiError.BadRequest(`Ошибка при удалении документа`)
    }
    
    return 1
  }
  
  static async destroys(data?: any[], options?: TransactionOptionsType): Promise<number> {
    const transaction = options?.transaction
    
    const documents = await documentModel.findAll({
      where: {id: data.map((document) => document.dataValues.id)},
      transaction: transaction.data
    })
    
    destroyFile(documents.map((document) => {
      return {path: document.dataValues.path}
    }))
    
    await documentModel.destroy({
      where: {id: documents.map((document) => document.dataValues.id)},
      transaction: transaction.data
    })
    
    return 1
  }
}

export {documentService}