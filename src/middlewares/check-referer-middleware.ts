import {ApiError} from "../exceptions/api-error";

require('dotenv').config()

module.exports = (req, res, next) => {
  try {
    const allowedReferers = [process.env.API_URL];
    const referer = req.get('referer');
    if (!allowedReferers.includes(referer)) {
      throw ApiError.BadRequest(`Пользователь не авторизован`)
    }
    next();
  } catch (e) {
    throw ApiError.BadRequest(`Пользователь не авторизован`)
  }
}