import {userService} from "../services/user";

class userController {
  static async registration(req, res, next) {
    try {
      const {email, password} = req.body
      const userData = await userService.registration(email,password)
      
      res.cookie('refreshToken',userData.refreshToken,{maxAge:+process.env.JWT_REFRESH_AGE * 24 * 60 * 60 * 1000, httpOnly:true})
      
      return res.json(userData)
    }catch (e){
      next(e)
    }
  }
  static async create(req, res, next) {
    try {
      const {email, password, level} = req.body
      const userData = await userService.create(email, password, level)
      
      res.cookie('refreshToken',userData.refreshToken,{maxAge:+process.env.JWT_REFRESH_AGE * 24 * 60 * 60 * 1000, httpOnly:true})
      
      return res.json(userData)
    }catch (e){
      next(e)
    }
  }
  static async login(req, res, next) {
    try {
      const {email, password} = req.body
      const userData = await userService.login(email,password)
      
      res.cookie('refreshToken',userData.refreshToken,{maxAge:+process.env.JWT_REFRESH_AGE * 24 * 60 * 60 * 1000, httpOnly:true})
      
      return res.json(userData)
    }catch (e){
      next(e)
    }
  }
  static async logout(req, res, next) {
    try {
      const {refreshToken} = req.cookies
      
      const token = await userService.logout(refreshToken)
      
      res.clearCookie('refreshToken')
      
      return res.json(token)
    }catch (e){
      next(e)
    }
  }
  static async activate(req, res, next) {
    try {
      const activateLink = req.params.link
      await userService.activate(activateLink)
      return res.redirect(process.env.CLIENT_URL)
    }catch (e){
      next(e)
    }
  }
  static async refresh(req, res, next) {
    try {
      const {refreshToken} = req.cookies
      const userData = await userService.refresh(refreshToken)
      
      res.cookie('refreshToken',userData.refreshToken ,{maxAge:+process.env.JWT_REFRESH_AGE * 24 * 60 * 60 * 1000, httpOnly:true})
      
      return res.json(userData)
    }catch (e){
      next(e)
    }
  }
  static async getUsers(req, res, next) {
    try {
    
    }catch (e){
      next(e)
    }
  }
}

export {userController}