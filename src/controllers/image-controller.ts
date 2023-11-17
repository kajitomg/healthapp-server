import { ApiError } from "../exceptions/api-error";
import {NextFunction, Request, Response} from "express";
import controllerWrapper from "../helpers/controller-wrapper";
import {imageService} from "../services/image";


class imageController {
  
  static async create(req:Request, res:Response, next:NextFunction) {
    try {
      const data = req.body
      
      const image = await controllerWrapper(
        async (transaction) => {
          return await imageService.create({...data }, { transaction })
        },
        (error) => ApiError.BadRequest(`Ошибка при s изображения`, error)
      )
      
      return res.status(200).json(image)
    } catch (e) {
      next(e)
    }
  }
  
  static async get(req:Request, res:Response, next:NextFunction) {
    try {
      const data = req.body
      
      const images = await controllerWrapper(
        async (transaction) => {
          return await imageService.get({id:data.id, path:data.path}, { transaction })
        },
        (error) => ApiError.BadRequest(`Ошибка при получении изображений`, error)
      )
      
      return res.status(200).json(images)
    } catch (e) {
      next(e)
    }
  }
  
}

export { imageController }