import {tokenService} from "../services/token";

module.exports = (req, res, next) => {
  try {
    const authorizationHeader = req.headers.authorization
    if(!authorizationHeader) throw new Error(`Пользователь не авторизован`)
    
    const accessToken = authorizationHeader.split(' ')[1]
    if(!accessToken) throw new Error(`Пользователь не авторизован`)
    
    const userData = tokenService.validateAccessToken(accessToken)
    if(!userData) throw new Error(`Пользователь не авторизован`)
    
    req.user = userData
    next()
  } catch (e){
    throw new Error(`Пользователь не авторизован`)
  }
}