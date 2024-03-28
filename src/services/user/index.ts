import {userDTO} from "../dto/user";
import {IMailAuth} from "../../models/user/mail-auth-model";
import {ApiError} from "../../exceptions/api-error";
import queriesNormalize from "../../helpers/queries-normalize";
import {IUser} from "../../models/user/user-model";
import createSlice from "../../helpers/create-slice";
import mailService from "../mail";

const bcrypt = require('bcrypt')
import {authDataService}  from '../auth-data';
import {tokenService} from '../token';
import {roleService} from '../role';
import {cartService} from "../cart";
import {likeService} from "../like";
const {DTOService} = require('../dto');
const {mailAuthModel} = require('../../models');
const {userModel} = require('../../models');

class userService {
  
  static create =  createSlice<{
    accessToken: string,
    refreshToken: string,
    item: Pick<IUser,'id' | 'name' | 'roleId'>,
    count:number
  },Pick<IUser,'name'|'password'|'email'|'roleId'>>(async ({data, options, queries}) => {
    const transaction = options?.transaction
    
    return await this.registration({data, queries, options:{transaction}})
  })
  
  static registration = createSlice<{
    accessToken: string,
    refreshToken: string,
    item: Pick<IUser,'id' | 'name' | 'roleId'>,
    count:number
  },Partial<Pick<IUser,'name'|'password'|'email'|'roleId'>>>(async ({data,options,queries}) => {//HEAD
    const transaction = options?.transaction

    const candidate = await userModel.findOne({where: {email:data.email}, transaction: transaction.data})
    if (candidate) {
      throw ApiError.BadRequest(`Пользователь с почтовым адресом ${data.email} уже существует`)
    }
    
    const hashedPassword = await bcrypt.hash(data.password, 5)
    let user = await userModel.create({email:data.email, password: hashedPassword, name:data.name}, {transaction: transaction.data})
    if (!user) {
      throw ApiError.BadRequest(`Ошибка при создании пользователя`)
    }
    
    const userDTO = await this.setRole({data:{id:user.id, roleId:data.roleId}, options:{transaction}})
    
    await cartService.create({data:{userId:userDTO.item.id},options:{transaction}})
    await likeService.create({data:{userId:userDTO.item.id},options:{transaction}})
    await authDataService.create({data:{userId:userDTO.item.id},options:{transaction}})
    
    const tokens = await tokenService.generateToken({data:userDTO.item})
    await tokenService.create({data:{userId:userDTO.item.id, refreshToken:tokens.refreshToken},options:{transaction}})
    
    const {count} = await this.count({queries, options:{transaction}})
    
    
    return {
      ...tokens,
      item: userDTO.item,
      count
    }
  })
  
  static adminLogin = createSlice<{
    accessToken: string,
    refreshToken: string,
    item: Pick<IUser, 'email' | 'id' | 'name' | 'roleId'>
  },Pick<IUser, 'email' | 'password'>>( async ({data, options}) => {
    const transaction = options?.transaction
    const user = await userModel.findOne({where: {email:data.email}, transaction: transaction.data})
    if (!user) {
      throw ApiError.BadRequest(`Пользователь с почтовым адресом ${data.email} не найден`)
    }
    const role = await roleService.getOneById({data:{id:user.roleId},options:{transaction}})
    if (+role.level > 300) {
      throw ApiError.BadRequest(`Нет доступа к сервису`)
    }
    
    return await this.login({data, options})
  })
  
  static login = createSlice<{
    accessToken: string,
    refreshToken: string,
    item: Pick<IUser, 'email' | 'id' | 'name' | 'roleId'>
  },Pick<IUser, 'email' | 'password'>>(async ({data, options}) => {
    const transaction = options?.transaction

    const user = await userModel.findOne({where: {email:data.email}, transaction: transaction.data})
    if (!user) {
      throw ApiError.BadRequest(`Пользователь с почтовым адресом ${data.email} не найден`)
    }
    const isPassEquals = await bcrypt.compare(data.password, user.password)
    if (!isPassEquals) {
      throw ApiError.BadRequest(`Неверный пароль`)
    }
    const userDTO = DTOService.user(user)
    
    const tokens = await tokenService.generateToken({data:userDTO})
    await tokenService.saveToken({data:{userId:userDTO.id, refreshToken:tokens.refreshToken},options:{transaction}})
    
    return {
      ...tokens,
      item: userDTO
    }
  })
  
  static logout = createSlice<string,{refreshToken: string}>(async ({data, options}) => {
    const transaction = options?.transaction

    const token = await tokenService.removeToken({data,options:{transaction}})
    
    if(!token){
      throw ApiError.BadRequest(`Ошибка при выходе из аккаунта`)
    }
    
    return token
  })
  
  static update = createSlice<{
    item: Pick<IUser, 'id' | 'email' | 'name' | 'roleId'>
  } ,Partial<Pick<IUser, 'id' | 'phonenumber' | 'name'>>>(async ({data, options}) => {
    const transaction = options?.transaction
    
    let user = await userModel.findOne({where: {id:data.id}, transaction: transaction.data})
    
    if (!user) {
      throw ApiError.BadRequest(`Ошибка при поиске пользователя`)
    }
    console.log(data,user)
    if (data.phonenumber) user.phonenumber = data.phonenumber
    if (data.name) user.name = data.name
    
    user = await user.save({transaction: transaction.data})
    
    const userdto = new userDTO(user)
    
    return {
      item: userdto
    }
  })
  
  static updateEmail = createSlice<{
    item: Pick<IUser, 'id' | 'email' | 'name' | 'roleId'>
  } ,Partial<Pick<IUser, 'id' | 'email'>>>(async ({data, options}) => {
    const transaction = options?.transaction
    
    let user = await userModel.findOne({where: {id:data.id}, transaction: transaction.data})
    
    if (!user) {
      throw ApiError.BadRequest(`Ошибка при поиске пользователя`)
    }

    if (data.email) {
      user.email = data.email
      const authData = await authDataService.get({data:{userId:user.id},options:{transaction}})
      const mailAuth = await mailService.get({data:{id:authData.item.mailAuthId},options:{transaction}})
      mailAuth.item.confirmation = false
      await mailAuth.item.save({transaction: transaction.data})
    }
    
    user = await user.save({transaction: transaction.data})
    
    const userdto = new userDTO(user)
    
    return {
      item: userdto
    }
  })
  
  static updatePassword = createSlice<{
    item: Pick<IUser, 'id' | 'email' | 'name' | 'roleId'>
  } ,Partial<Pick<IUser, 'id' | 'password'> & {currentPassword:string}>>(async ({data, options}) => {
    const transaction = options?.transaction

    let user = await userModel.findOne({where: {id:data.id}, transaction: transaction.data})
    
    if (!user) {
      throw ApiError.BadRequest(`Ошибка при поиске пользователя`)
    }
    
    
    if (data.password) {
      const isPassEquals = await bcrypt.compare(data.currentPassword, user.password)
      if (!isPassEquals) {
        throw ApiError.BadRequest(`Неверный пароль`)
      }
      
      user.password = await bcrypt.hash(data.password, 5)
    }
    
    user = await user.save({transaction: transaction.data})
    
    const userdto = new userDTO(user)
    
    return {
      item: userdto
    }
  })
  
  static destroy = createSlice<{
    count: number
  },Pick<IUser, 'id'>>(async ({data, queries, options}) => {
    const transaction = options?.transaction
    
    const token = await tokenService.destroy({data:{userId:data.id},options:{transaction}})
    const authData = await authDataService.destroy({data:{userId:data.id},options:{transaction}})
    const user = await userModel.destroy({where: data, transaction: transaction.data})
    if (!user && !authData && !token) {
      throw ApiError.BadRequest(`Ошибка при удалении пользователя`)
    }
    
    const {count} = await this.count({queries, options:{transaction}})
    
    return {
      count
    }
  })
  
  static setRole = createSlice<{
    item: Pick<IUser, 'email' | 'id' | 'name' | 'roleId'>
  },Pick<IUser,'id' | 'roleId'>>(async ({data, options}) => {
    const transaction = options?.transaction
    
    const userData = await userModel.findOne({where: {id: data.id}, transaction: transaction.data})
    
    if (!userData) {
      throw ApiError.BadRequest(`Пользователя с данным идентификатором не существует`)
    }
    
    const role = await roleService.getOneById({data:{id:data.roleId || 4},options:{transaction}})
    
    userData.roleId = role.id
    const user = await userData.save({transaction: transaction.data})
    if (!user) {
      throw ApiError.BadRequest(`Ошибка при сохранении пользователя`)
    }
    
    return {
      item: DTOService.user(user)
    }
  })
  
  static getOneById = createSlice<{
    item:Pick<IUser, 'email' | 'id' | 'name' | 'roleId'>
  },Pick<IUser, 'id'>>(async ({data, options}) => {
    const transaction = options?.transaction
    
    const user = await userModel.findOne({where: data, transaction: transaction.data})
    if (!user) {
      throw ApiError.BadRequest(`Пользователя с данным идентификатором не существует`)
    }
    
    return {
      item:user
    }
  })
  
  static gets = createSlice<{
    list: Pick<IUser, 'email' | 'id' | 'name' | 'roleId'>[],
    count: number
  }>(async ({queries, options}) => {
    const transaction = options?.transaction
    
    const normalizeQueries = queriesNormalize(queries)

    const users = await userModel.findAll({
      where: {
        ...normalizeQueries.searched
      },
      raw: true,
      offset: normalizeQueries.offset,
      limit: normalizeQueries.limit,
      transaction: transaction.data,
      order: normalizeQueries.order
    })
    
    const {count} = await this.count({queries, options:{transaction}})

    const result = {
      list: users.map(user => new userDTO(user)),
      count
    }
    
    /*if (!result.list || !result.count) {
      await t.rollback(transaction.data)
      throw ApiError.BadRequest(`Ошибка при поиске пользователей`)
    }*/
    
    return result
  })
  
  static count = createSlice<{
    count: number
  }>(async ({queries, options}) => {
    const transaction = options?.transaction
    
    const normalizeQueries = queriesNormalize(queries)
    
    const count = await userModel.count({
      where: {
        ...normalizeQueries.searched
      },
      raw: true,
      transaction: transaction.data,
      order: normalizeQueries.order
    })
    
    return {
      count
    }
  })
  
  static activate = createSlice<{
    item:IMailAuth
  },{activateLink: string}>(async ({data, options}) => {
    const transaction = options?.transaction
    
    const mail = await mailAuthModel.findOne({where: {url: data.activateLink}})
    if (!mail) {
      throw ApiError.BadRequest(`Некорректная ссылка активации`)
    }
    
    mail.confirmation = true
    const mailData = await mail.save({transaction: transaction.data})
    
    return {
      item: mailData
    }
  })
  
  static refresh = createSlice<{
    accessToken: string,
    refreshToken: string,
    item: Pick<IUser, 'email' | 'id' | 'name' | 'roleId'>
  },{refreshToken:string}>(async ({data, options}) => {
    const transaction = options?.transaction
    
    if (!data.refreshToken) {
      throw ApiError.UnauthorizedError()
    }
    
    const userData = await tokenService.validateRefreshToken({data:{token:data.refreshToken}})
    const tokenFromDB = await tokenService.getToken({data:{refreshToken:data.refreshToken},options:{transaction}})
    if (!userData || !tokenFromDB) throw ApiError.UnauthorizedError()
    
    const user = await userModel.findOne({where: {id: userData.id}, transaction: transaction.data})
    if (!user) {
      throw ApiError.BadRequest(`Не удалось найти пользователя`)
    }
    const userdto = DTOService.user(user)
    
    const tokens = await tokenService.generateToken({data:userdto})
    
    await tokenService.saveToken({data:{userId:userdto.id,refreshToken:tokens.refreshToken},options:{transaction}})
    
    return {
      ...tokens,
      item: userdto
    }
  })
  
}

export {userService}