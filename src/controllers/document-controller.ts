import {ApiError} from "../exceptions/api-error";
import {NextFunction, Request, Response} from "express";
import controllerWrapper from "../helpers/controller-wrapper";
import {documentService} from "../services/document";
import {createDTO} from "../helpers/create-dto";
import {IDocument} from "../models/document/document-model";


class documentController {
  
  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const props = createDTO<IDocument, keyof Pick<IDocument, 'path' | 'name'>>(req.body,['path', 'name'])
      
      const document = await controllerWrapper(
        async (transaction) => {
          return await documentService.create({data:props, options:{transaction}})
        },
        (error) => ApiError.BadRequest(`Ошибка при добавлении документа`, error)
      )
      
      return res.status(200).json(document)
    } catch (e) {
      next(e)
    }
  }
  
  static async get(req: Request, res: Response, next: NextFunction) {
    try {
      const props = createDTO<IDocument, keyof Pick<IDocument, 'id' | 'path'>>(req.body,['id', 'path'])
      
      const documents = await controllerWrapper(
        async (transaction) => {
          return await documentService.get({data:props, options:{transaction}})
        },
        (error) => ApiError.BadRequest(`Ошибка при получении документов`, error)
      )
      
      return res.status(200).json(documents)
    } catch (e) {
      next(e)
    }
  }
  
  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const props = createDTO<IDocument, keyof Pick<IDocument, 'id' | 'name'>>(req.body,['id', 'name'])
      
      const document = await controllerWrapper(
        async (transaction) => {
          return await documentService.update({data:props, options:{transaction}})
        },
        (error) => ApiError.BadRequest(`Ошибка при обновлении документа`, error)
      )
      
      return res.status(200).json(document)
    } catch (e) {
      next(e)
    }
  }
  
  static async destroy(req: Request, res: Response, next: NextFunction) {
    try {
      const props = createDTO<IDocument,'id'>(req.body,['id'])
      
      const document = await controllerWrapper(
        async (transaction) => {
          return await documentService.destroy({data:props, options:{transaction}})
        },
        (error) => ApiError.BadRequest(`Ошибка при удалении документа`, error)
      )
      
      return res.status(200).json(document)
    } catch (e) {
      next(e)
    }
  }
}

export {documentController}