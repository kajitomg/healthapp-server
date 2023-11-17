import {ApiError} from "../exceptions/api-error";
import {roleService} from "../services/role";
import {NextFunction, Request, Response} from "express";
import controllerWrapper from "../helpers/controller-wrapper";


class roleController {
  
  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const {name, level} = req.body
      
      await controllerWrapper(
        async (transaction) => {
          await roleService.create(level, name, {transaction})
        },
        (error) => ApiError.BadRequest(`Ошибка при создании роли`, error)
      )
      
      return res.status(200).json({text: 'Роль успешно создана'})
    } catch (e) {
      next(e)
    }
  }
  
  static async roles(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await controllerWrapper(
        async (transaction) => {
          return await roleService.getAll({transaction})
        },
        (error) => ApiError.BadRequest(`Ошибка при восстановлении доступа к аккаунту`, error)
      )
      
      return res.status(200).json(data)
    } catch (e) {
      next(e)
    }
  }
}

export {roleController}