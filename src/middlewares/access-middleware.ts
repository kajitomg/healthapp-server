import {tokenService} from "../services/token";
import {roleService} from "../services/role";

module.exports = (level) => {
  return async (req, res, next) => {
    try {
      const authorizationHeader = req.headers.authorization
      if(!authorizationHeader) throw new Error(`Пользователь не авторизован`)
      
      const accessToken = authorizationHeader.split(' ')[1]
      if(!accessToken) throw new Error(`Пользователь не авторизован`)
      
      const userData = tokenService.validateAccessToken(accessToken)
      if(!userData) throw new Error(`Пользователь не авторизован`)
      
      const roleData = await roleService.getOneId(userData.roleId)
      if(roleData.level < level) throw new Error(`Нет доступа`)
      
      req.user = userData
      next()
    } catch (e){
      throw new Error(`Пользователь не авторизован`)
    }
  }
}
