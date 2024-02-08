import { ApiError } from "../exceptions/api-error";
import {NextFunction, Request, Response} from "express";
import controllerWrapper from "../helpers/controller-wrapper";
import {imageService} from "../services/image";
import {createDTO} from "../helpers/create-dto";
import {IImage} from "../models/image/image-model";


class imageController {
  
  static async create(req:Request, res:Response, next:NextFunction) {
    try {
      const props = createDTO<IImage, keyof Pick<IImage, 'path' | 'name'>>(req.body,['path', 'name'])
      
      const image = await controllerWrapper(
        async (transaction) => {
          return await imageService.create({data:props,options:{ transaction }})
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
      const props = createDTO<IImage, 'id' | 'path'>(req.body,['id', 'path'])
      
      const images = await controllerWrapper(
        async (transaction) => {
          return await imageService.get({data:props,options:{ transaction }})
        },
        (error) => ApiError.BadRequest(`Ошибка при получении изображений`, error)
      )
      
      return res.status(200).json(images)
    } catch (e) {
      next(e)
    }
  }
  
  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const props = createDTO<IImage, 'id' | 'name'>(req.body,['id', 'name'])
      
      const image = await controllerWrapper(
        async (transaction) => {
          return await imageService.update({data:props, options:{transaction}})
        },
        (error) => ApiError.BadRequest(`Ошибка при обновлении изображения`, error)
      )
      
      return res.status(200).json(image)
    } catch (e) {
      next(e)
    }
  }
  
  static async destroy(req: Request, res: Response, next: NextFunction) {
    try {
      const props = createDTO<IImage, 'id'>(req.body,['id'])
      
      const image = await controllerWrapper(
        async (transaction) => {
          return await imageService.destroy({data:props, options:{transaction}})
        },
        (error) => ApiError.BadRequest(`Ошибка при удалении изображения`, error)
      )
      
      return res.status(200).json(image)
    } catch (e) {
      next(e)
    }
  }
}

export { imageController }