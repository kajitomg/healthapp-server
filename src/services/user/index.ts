import {userDTO} from "../dto/user";
import {UserI} from "../../models/user-model";
import {MailAuthI} from "../../models/mail-auth-model";
import {ApiError} from "../../exceptions/api-error";

const bcrypt = require('bcrypt')
const {authDataService} = require('../auth-data');
const {tokenService} = require('../token');
const {roleService} = require('../role');
const {DTOService} = require('../dto');
const {mailAuthModel} = require('../../models');
const {userModel} = require('../../models');

class userService {
  static async create(email:string, password:string, level:string):Promise<{accessToken:string,refreshToken:string,user:userDTO}> {
    const roleData = await roleService.getOneLevel(level)
    const data = await this.registration(email, password)
    const user = await this.setRole(data.user.id, roleData.id)
    const userDto = DTOService.user(user)
    
    return {
      ...data,
      user:userDto
    }
    
  }
  static async registration(email:string, password:string):Promise<{accessToken:string,refreshToken:string,user:userDTO}> {
    const candidate = await userModel.findOne({where:{email}})
    if(candidate) throw ApiError.BadRequest(`Пользователь с почтовым адресом ${email} уже существует`)
    
    const hashedPassword = await bcrypt.hash(password, 5)
    const user = await userModel.create({email, password:hashedPassword})
    const userdto = DTOService.user(user)
    
    await authDataService.create(userdto.id)
    
    const tokens = await tokenService.generateToken({...userdto})
    await tokenService.create(userdto.id,tokens.refreshToken)
    
    return {
      ...tokens,
      user:userdto
    }
  }
  
  static async login(email:string, password:string):Promise<{accessToken:string,refreshToken:string,user:userDTO}> {
    const user = await userModel.findOne({where:{email}})
    if(!user) throw ApiError.BadRequest(`Пользователь с почтовым адресом ${email} не найден`)
    
    const isPassEquals = await bcrypt.compare(password, user.password)
    if(!isPassEquals) throw ApiError.BadRequest(`Неверный пароль`)
    const userdto = DTOService.user(user)
    
    const tokens = await tokenService.generateToken({...userdto})
    await tokenService.saveToken(userdto.id,tokens.refreshToken)
    
    return {
      ...tokens,
      user:userdto
    }
  }
  
  static async logout(refreshToken:string):Promise<string> {
    const token = await tokenService.removeToken(refreshToken)
    
    return token
  }
  
  static async setRole(userId:number, roleId:number):Promise<UserI> {
    const user = await userModel.findOne({where:{id:userId}})
    if (!user) throw ApiError.BadRequest(`Пользователя с данным идентификатором не существует`)
    
    user.roleId = roleId
    return await user.save()
  }
  
  static async getOneId(id:number):Promise<UserI> {
    const user = await userModel.findOne({where:{id}})
    if (!user) throw ApiError.BadRequest(`Пользователя с данным идентификатором не существует`)
    
    return user
  }
  static async activate(activateLink:string):Promise<MailAuthI> {
    const mail = await mailAuthModel.findOne({where:{url:activateLink}})
    if (!mail) throw ApiError.BadRequest(`Некорректная ссылка активации`)
    
    mail.confirmation = true
    return await mail.save()
  }
  
  static async refresh(refreshToken):Promise<{accessToken:string,refreshToken:string,user:userDTO}> {
    if(!refreshToken) throw ApiError.UnauthorizedError()
    
    const userData = tokenService.validateRefreshToken(refreshToken)
    const tokenFromDB = await tokenService.getToken(refreshToken)
    if(!userData || !tokenFromDB) throw ApiError.UnauthorizedError()
    
    const user = await userModel.findOne({where:{id:userData.id}})
    const userdto = DTOService.user(user)
    
    const tokens = await tokenService.generateToken({...userdto})
    await tokenService.saveToken(userdto.id,tokens.refreshToken)
    
    return {
      ...tokens,
      user:userdto
    }
  }
  
}

export {userService}