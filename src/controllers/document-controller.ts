import {ApiError} from "../exceptions/api-error";
import {NextFunction, Request, Response} from "express";
import controllerWrapper from "../helpers/controller-wrapper";
import {documentService} from "../services/document";


class documentController {
  
  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const data = req.body
      
      const document = await controllerWrapper(
        async (transaction) => {
          return await documentService.create({...data}, {transaction})
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
      const data = req.body
      
      const documents = await controllerWrapper(
        async (transaction) => {
          return await documentService.get({id: data.id, path: data.path}, {transaction})
        },
        (error) => ApiError.BadRequest(`Ошибка при получении документов`, error)
      )
      
      return res.status(200).json(documents)
    } catch (e) {
      next(e)
    }
  }
  
}

export {documentController}