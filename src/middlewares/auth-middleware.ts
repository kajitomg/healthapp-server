import {ApiError} from "../exceptions/api-error";
import {tokenService} from "../services/token";

module.exports = (req, res, next) => {
  try {
    let accessToken = req.headers.authorization
    if (accessToken.split(' ')[1])
      accessToken = accessToken.split(' ')[1]
    
    if (!accessToken) throw ApiError.UnauthorizedError()
    
    const userData = tokenService.validateAccessToken(accessToken)
    if (!userData) throw ApiError.UnauthorizedError()
    
    req.user = userData
    next()
  } catch (e) {
    throw ApiError.BadRequest(`Пользователь не авторизован`)
  }
}