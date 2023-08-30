import {TokenI} from "../../models/token-model";
import {userDTO} from "../dto/user";

require('dotenv').config()
const jwt = require('jsonwebtoken')
const {tokenModel} = require('../../models');

class tokenService {
  static async create(userId:number, refreshToken:string):Promise<TokenI> {
    return await tokenModel.create({userId, refresh:refreshToken})
  }
  
  static generateToken(payload:any):{accessToken:string,refreshToken:string} {
    const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_KEY, {expiresIn:`${process.env.JWT_ACCESS_AGE}m`})
    const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_KEY, {expiresIn:`${process.env.JWT_REFRESH_AGE}d`})
    
    return {
      accessToken,
      refreshToken
    }
  }
  
  static validateAccessToken(token:string):userDTO | null {
    try {
      const userData = jwt.verify(token, process.env.JWT_ACCESS_KEY)
      return userData
    }
    catch (e){
      return null
    }
  }
  
  static validateRefreshToken(token:string):userDTO | null {
    try {
      const userData = jwt.verify(token, process.env.JWT_REFRESH_KEY)
      return userData
    }
    catch (e){
      return null
    }
  }
  
  static async saveToken(userId:number, refreshToken:string):Promise<TokenI> {
    const tokenData = await tokenModel.findOne({where:{userId}})
    if(tokenData){
      tokenData.refresh = refreshToken
      return tokenData.save()
    }
    
    return await this.create(userId,refreshToken)
  }
  
  static async removeToken(refreshToken:string):Promise<string> {
    const token = await tokenModel.destroy({where:{refresh:refreshToken}})
    
    return token
  }
  static async getToken(refreshToken:string):Promise<string> {
    const token = await tokenModel.findOne({where:{refresh:refreshToken}})
    
    return token
  }
}

export {tokenService}
