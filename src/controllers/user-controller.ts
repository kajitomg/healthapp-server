import {ApiError} from "../exceptions/api-error";
import {userService} from "../services/user";
import controllerWrapper from "../helpers/controller-wrapper";
import {NextFunction, Request, Response} from "express";

class userController {
  static async registration(req: Request, res: Response, next: NextFunction) {
    try {
      const {email, password} = req.body
      
      const data = await controllerWrapper(
        async (transaction) => {
          const data = await userService.registration(email, password, undefined, undefined, {transaction})
          
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
      const {email, password, name, role} = req.body
      
      const data = await controllerWrapper(
        async (transaction) => {
          return await userService.create(email, password, name, role, req.query, {transaction})
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
      const {email, name} = req.body
      
      const userData = await controllerWrapper(
        async (transaction) => {
          return await userService.update(email, name, {transaction})
        },
        (error) => ApiError.BadRequest(`Ошибка при обновлении пользователя`, error)
      )
      
      return res.status(200).json(userData)
    } catch (e) {
      next(e)
    }
  }
  
  static async destroy(req: Request, res: Response, next: NextFunction) {
    try {
      const {id} = req.body
      
      const data = await controllerWrapper(
        async (transaction) => {
          return await userService.destroy(id, req.query, {transaction})
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
      const {email, password} = req.body
      
      const data = await controllerWrapper(
        async (transaction) => {
          const data = await userService.login(email, password, {transaction})
          
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
      const {email, password} = req.body
      
      const data = await controllerWrapper(
        async (transaction) => {
          const data = await userService.adminLogin(email, password, {transaction})
          
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
          const data = await userService.logout(refreshToken, {transaction})
          
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
          await userService.activate(activateLink, {transaction})
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
          const data = await userService.refresh(refreshToken, {transaction})
          
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
          return await userService.gets(queries, {transaction})
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