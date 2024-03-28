import {ApiError} from "../exceptions/api-error";
import {userService} from "../services/user";
import controllerWrapper from "../helpers/controller-wrapper";
import {NextFunction, Request, Response} from "express";
import {createDTO} from "../helpers/create-dto";
import {IUser} from "../models/user/user-model";

class userController {
  static async registration(req: Request, res: Response, next: NextFunction) {
    try {
      const props = createDTO<IUser,keyof Pick<IUser,'name'|'password'|'email'>>(req.body,['name','password','email'])
      
      const data = await controllerWrapper(
        async (transaction) => {

          const data = await userService.registration({data:props,options:{transaction}})
          
          res.cookie('refreshToken', data.refreshToken, {
            maxAge: +process.env.JWT_REFRESH_AGE * 24 * 60 * 60 * 1000,
            httpOnly: true,
            sameSite: 'none',
            secure: true
          })
          
          return data
        },
        (error) => ApiError.BadRequest(`Ошибка при создании пользователя`, error)
      )
      
      return res.status(200).json(data)
    } catch (e) {
      next(e)
    }
  }
  
  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const props = createDTO<IUser,keyof Pick<IUser,'name'|'password'|'email'|'roleId'>>(req.body,['name','password','email','roleId'])
      const queries = req.query
      
      const data = await controllerWrapper(
        async (transaction) => {
          
          return await userService.create({data:props, options:{transaction}, queries})
        },
        (error) => ApiError.BadRequest(`Ошибка при создании пользователя`, error)
      )
      
      return res.status(200).json(data)
    } catch (e) {
      next(e)
    }
  }
  
  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const props = createDTO<IUser,'name' | 'phonenumber'>(req.body,['name','phonenumber'])
      const params = createDTO<{ id?:number },'id'>(req.params,['id'])
     
      const userData = await controllerWrapper(
        async (transaction) => {
          //@ts-ignore
          if(params.id !== req.user.id){
            ApiError.BadRequest(`Нет доступа`)
          }
          return await userService.update({data:{...props,...params}, options:{transaction}})
        },
        (error) => ApiError.BadRequest(`Ошибка при обновлении пользователя`, error)
      )
      
      return res.status(200).json(userData)
    } catch (e) {
      next(e)
    }
  }
  
  static async updatePassword(req: Request, res: Response, next: NextFunction) {
    try {
      const props = createDTO<IUser & {currentPassword?:string},'password' | 'currentPassword'>(req.body,['password','currentPassword'])
      const params = createDTO<{ id?:number },'id'>(req.params,['id'])
      
      const userData = await controllerWrapper(
        async (transaction) => {
          //@ts-ignore
          if(params.id !== req.user.id){
            ApiError.BadRequest(`Нет доступа`)
          }
          return await userService.updatePassword({data:{...props,...params}, options:{transaction}})
        },
        (error) => ApiError.BadRequest(`Ошибка при обновлении пароля пользователя`, error)
      )
      
      return res.status(200).json(userData)
    } catch (e) {
      next(e)
    }
  }
  
  static async updateEmail(req: Request, res: Response, next: NextFunction) {
    try {
      const props = createDTO<IUser,'email'>(req.body,['email'])
      const params = createDTO<{ id?:number },'id'>(req.params,['id'])
      
      const userData = await controllerWrapper(
        async (transaction) => {
          //@ts-ignore
          if(params.id !== req.user.id){
            ApiError.BadRequest(`Нет доступа`)
          }
          return await userService.updateEmail({data:{...props,...params}, options:{transaction}})
        },
        (error) => ApiError.BadRequest(`Ошибка при обновлении почты пользователя`, error)
      )
      
      return res.status(200).json(userData)
    } catch (e) {
      next(e)
    }
  }
  
  static async destroy(req: Request, res: Response, next: NextFunction) {
    try {
      const props = createDTO<IUser,'id'>(req.body,['id'])
      const queries = req.query
      
      const data = await controllerWrapper(
        async (transaction) => {
          return await userService.destroy({data:props,queries, options:{transaction}})
        },
        (error) => ApiError.BadRequest(`Ошибка при удалении пользователя`, error)
      )
      
      return res.status(200).status(200).json({...data, message: 'Пользователь успешно удален'})
    } catch (e) {
      next(e)
    }
  }
  
  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const props = createDTO<IUser,'email' | 'password'>(req.body,['email', 'password'])
      
      const data = await controllerWrapper(
        async (transaction) => {
          const data = await userService.login({data:props,options:{transaction}})
          
          res.cookie('refreshToken', data.refreshToken, {
            maxAge: +process.env.JWT_REFRESH_AGE * 24 * 60 * 60 * 1000,
            httpOnly: true,
            sameSite: 'none',
            secure: true
          })
          
          return data
        },
        (error) => ApiError.BadRequest(`Ошибка при авторизации пользователя`, error)
      )
      return res.status(200).json(data)
    } catch (e) {
      next(e)
    }
  }
  
  static async adminLogin(req: Request, res: Response, next: NextFunction) {
    try {
      const props = createDTO<IUser,'email' | 'password'>(req.body,['email', 'password'])
      
      const data = await controllerWrapper(
        async (transaction) => {
          const data = await userService.adminLogin({data:props,options:{transaction}})
          
          res.cookie('refreshToken', data.refreshToken, {
            maxAge: +process.env.JWT_REFRESH_AGE * 24 * 60 * 60 * 1000,
            httpOnly: true,
            sameSite: 'none',
            secure: true
          })
          
          return data
        },
        (error) => ApiError.BadRequest(`Ошибка при авторизации пользователя`, error)
      )
      
      return res.status(200).json(data)
      
    } catch (e) {
      next(e)
    }
  }
  
  static async logout(req: Request, res: Response, next: NextFunction) {
    try {
      const {refreshToken} = req.cookies
      
      const data = await controllerWrapper(
        async (transaction) => {
          const data = await userService.logout({data:{refreshToken}, options:{transaction}})
          
          res.clearCookie('refreshToken')
          
          return data
        },
        (error) => ApiError.BadRequest(`Ошибка при выходе из аккаунта`, error)
      )
      
      return res.status(200).json(data)
    } catch (e) {
      next(e)
    }
  }
  
  static async activate(req: Request, res: Response, next: NextFunction) {
    try {
      const activateLink = req.params.link
      
      await controllerWrapper(
        async (transaction) => {
          await userService.activate({data:{activateLink}, options:{transaction}})
        },
        (error) => ApiError.BadRequest(`Ошибка при активации аккаунта`, error)
      )
      
      return res.status(200).redirect(process.env.CLIENT_URL)
    } catch (e) {
      next(e)
    }
  }
  
  static async refresh(req: Request, res: Response, next: NextFunction) {
    try {
      const {refreshToken} = req.cookies
      
      const data = await controllerWrapper(
        async (transaction) => {
          const data = await userService.refresh({data:{refreshToken}, options:{transaction}})
          
          res.cookie('refreshToken', data.refreshToken, {
            maxAge: +process.env.JWT_REFRESH_AGE * 24 * 60 * 60 * 1000,
            httpOnly: true,
            sameSite: 'none',
            secure: true
          })
          
          return data
        },
        (error) => ApiError.BadRequest(`Ошибка при восстановлении доступа к аккаунту`, error)
      )
      
      return res.status(200).json(data)
    } catch (e) {
      next(e)
    }
  }
  
  static async gets(req: Request, res: Response, next: NextFunction) {
    try {
      const queries = req.query
      
      const data = await controllerWrapper(
        async (transaction) => {
          return await userService.gets({queries, options:{transaction}})
        },
        (error) => ApiError.BadRequest(`Ошибка при восстановлении доступа к аккаунту`, error)
      )
      
      return res.status(200).json(data)
    } catch (e) {
      next(e)
    }
  }
}

export {userController}