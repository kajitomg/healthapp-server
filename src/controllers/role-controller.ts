import {ApiError} from "../exceptions/api-error";
import {roleService} from "../services/role";
import {NextFunction, Request, Response} from "express";
import controllerWrapper from "../helpers/controller-wrapper";
import {createDTO} from "../helpers/create-dto";
import {IRole} from "../models/user/role-model";


class roleController {
  
  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const props = createDTO<IRole,keyof Pick<IRole, 'name' | 'level'>>(req.body,['name','level'])
      
      await controllerWrapper(
        async (transaction) => {
          await roleService.create({data:props, options:{transaction}})
        },
        (error) => ApiError.BadRequest(`Ошибка при создании роли`, error)
      )
      return res.status(200).json({text: 'Роль успешно создана'})
    } catch (e) {
      console.log(e)
      next(e)
    }
  }
  
  static async roles(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await controllerWrapper(
        async (transaction) => {
          return await roleService.getAll({options:{transaction}})
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