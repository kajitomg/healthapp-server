import {ApiError} from "../../exceptions/api-error";
import {documentModel} from "../../models";
import {IDocument} from "../../models/document/document-model";
import destroyFile from "../../helpers/destroy-file";
import createSlice from "../../helpers/create-slice";


class documentService {
  
  static create = createSlice<{
    item:IDocument
  },Pick<IDocument, 'path' | 'name'>>(async ({data, options}) => {
    const transaction = options?.transaction
    
    const result = await documentModel.create(data, {transaction: transaction.data})
    
    if (!result) {
      throw ApiError.BadRequest(`Ошибка при добавлении документа`)
    }
    
    return {
      item:result
    }
  })
  
  static update = createSlice<{
    item:IDocument
  },Pick<IDocument, 'id' | 'name'>>(async ({data, options}) => {
    const transaction = options?.transaction
    
    const document = await documentModel.findOne({where: {id:data.id}, transaction: transaction.data})
    
    await document.update(data,{transaction: transaction.data})
    
    if (!document) {
      throw ApiError.BadRequest(`Ошибка при обновлении документа`)
    }
    
    return {
      item:document
    }
  })
  
  static get = createSlice<{
    item:IDocument
  },Pick<IDocument, 'id' | 'path'>>(async ({data, options}) => {
    const transaction = options?.transaction
    
    const result = await documentModel.findOne({where: data, transaction: transaction.data})
    
    if (!result) {
      throw ApiError.BadRequest(`Ошибка при получении документа`)
    }
    
    return {
      item:result
    }
  })
  
  static destroy = createSlice<number, Pick<IDocument, 'id'>>(async ({data, options}) => {
    const transaction = options?.transaction
    
    const result = await documentModel.findOne({where: data, transaction: transaction.data})
    const destroyData = result.dataValues
    
    const document = await result.destroy({transaction: transaction.data})
    
    if (!document) {
      throw ApiError.BadRequest(`Ошибка при удалении документа`)
    }
    destroyFile([destroyData])
    
    return document
  })
  
  static destroys = createSlice<number,{items:IDocument[]}>(async ({data, options}) => {
    const transaction = options?.transaction
    
    const documents = await documentModel.findAll({
      where: {id: data.items.map((document) => document.dataValues.id)},
      transaction: transaction.data
    })
    
    destroyFile(documents.map((document) => {
      return {path: document.dataValues.path}
    }))
    
    return await documentModel.destroy({
      where: {id: documents.map((document) => document.dataValues.id)},
      transaction: transaction.data
    })
  })
}

export {documentService}