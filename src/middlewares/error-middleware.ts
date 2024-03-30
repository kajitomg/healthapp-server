import {ApiError} from "../exceptions/api-error";
import multer from "multer"

export default (err, req, res, next) => {
  
  if (err instanceof multer.MulterError) {
    return res.status(err.status).json({message: err.message, errors: err.errors})
  }
  if (err instanceof ApiError) {
    return res.status(err.status).json({message: err.message, errors: err.errors})
  }
  return res.status(500).json({message: 'Непредвиденная ошибка'})
}