import {ApiError} from "../../exceptions/api-error";
import {IToken, tokenModel} from "../../models/user/token-model";
import {userDTO} from "../dto/user";
import createSlice from "../../helpers/create-slice";
require('dotenv').config()
import jwt from 'jsonwebtoken'

class tokenService {
  static create = createSlice<IToken,{userId: number, refreshToken: string}>(async ({data, options}) => {
    const transaction = options?.transaction
    
    const token = await tokenModel.create({userId:data.userId,refresh:data.refreshToken}, {transaction: transaction.data})
    if (!token) {
      throw ApiError.BadRequest(`Ошибка при создании пользователя`)
    }
    return token
    
  })
  
  static destroy = createSlice<number,{userId: number}>(async ({data, options}) => {
    const transaction = options?.transaction
    
    const token = await tokenModel.destroy({where: data, transaction: transaction.data})
    if (!token) {
      return 1
    }
    return token
    
  })
  
  static generateToken = createSlice<{ accessToken: string, refreshToken: string },Partial<userDTO>>(async  ({data}) => {
     const accessToken = jwt.sign(JSON.parse(JSON.stringify(data)), process.env.JWT_ACCESS_KEY, {expiresIn: `${process.env.JWT_ACCESS_AGE}m`})
    const refreshToken = jwt.sign(JSON.parse(JSON.stringify(data)), process.env.JWT_REFRESH_KEY, {expiresIn: `${process.env.JWT_REFRESH_AGE}d`})
    
    return {
      accessToken,
      refreshToken
    }
  })
  
  static validateAccessToken = createSlice<userDTO | null,{token: string}>(async ({data}) => {
    try {
      return jwt.verify(data.token, process.env.JWT_ACCESS_KEY)
    } catch (e) {
      return null
    }
  })
  
  static validateRefreshToken = createSlice<userDTO | null,{token: string}>(({data}) => {
    try {
      return jwt.verify(data.token, process.env.JWT_REFRESH_KEY)
    } catch (e) {
      return null
    }
  })
  
  static saveToken = createSlice<IToken,{userId: number, refreshToken: string}>(async ({data, options}) => {
    const transaction = options?.transaction
    
    const tokenData = await tokenModel.findOne({where: {userId:data.userId}, transaction: transaction.data})
    
    if (tokenData) {
      tokenData.refresh = data.refreshToken
      const token = await tokenData.save({transaction: transaction.data})
      if (!token) {
        throw ApiError.BadRequest(`Ошибка при сохранении токена`)
      }
      return token
    }
    return await this.create({data, options:{transaction: options.transaction}})
    
  })
  
  static removeToken = createSlice<number,{refreshToken: string}>(async ({data, options}) => {
    const transaction = options?.transaction
    
    const token = await tokenModel.destroy({where: {refresh: data.refreshToken}, transaction: transaction.data})
    if (!token) {
      throw ApiError.BadRequest(`Ошибка при удалении токена`)
    }
    return token
  })
  
  static getToken = createSlice<IToken,{refreshToken: string}>(async ({data, options}) => {
    const transaction = options?.transaction

    const token = await tokenModel.findOne({where: {refresh: data.refreshToken}, transaction: transaction.data})

    if (!token) {
      throw ApiError.BadRequest(`Ошибка при поиске токена`)
    }
    return token
  })
}

export {tokenService}
