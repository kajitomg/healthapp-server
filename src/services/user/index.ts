import {userDTO} from "../dto/user";
import {IMailAuth} from "../../models/user/mail-auth-model";
import {ApiError} from "../../exceptions/api-error";
import {MyTransactionType} from "../../helpers/transaction";
import queriesNormalize from "../../helpers/queries-normalize";
import {IUser} from "../../models/user/user-model";
import createSlice from "../../helpers/create-slice";

const bcrypt = require('bcrypt')
import {authDataService}  from '../auth-data';
import {tokenService} from '../token';
import {roleService} from '../role';
const {DTOService} = require('../dto');
const {mailAuthModel} = require('../../models');
const {userModel} = require('../../models');
const t: MyTransactionType = require('../../helpers/transaction')

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
  },Pick<IUser,'name'|'password'|'email'|'roleId'>>(async ({data,options,queries}) => {//HEAD
    const transaction = options?.transaction
    
    const candidate = await userModel.findOne({where: {email:data.email}, transaction: transaction.data})
    if (candidate) {
      await t.rollback(transaction.data)
      throw ApiError.BadRequest(`Пользователь с почтовым адресом ${data.email} уже существует`)
    }
    
    const hashedPassword = await bcrypt.hash(data.password, 5)
    let user = await userModel.create({email:data.email, password: hashedPassword, name:data.name}, {transaction: transaction.data})
    if (!user) {
      await t.rollback(transaction.data)
      throw ApiError.BadRequest(`Ошибка при создании пользователя`)
    }
    
    const userDTO = await this.setRole({data:{id:user.id, roleId:data.roleId}, options:{transaction}})
    
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
      await t.rollback(transaction.data)
      throw ApiError.BadRequest(`Пользователь с почтовым адресом ${data.email} не найден`)
    }
    const role = await roleService.getOneById({data:{id:user.roleId},options:{transaction}})
    if (+role.level > 300) {
      await t.rollback(transaction.data)
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
      await t.rollback(transaction.data)
      throw ApiError.BadRequest(`Пользователь с почтовым адресом ${data.email} не найден`)
    }
    
    const isPassEquals = await bcrypt.compare(data.password, user.password)
    if (!isPassEquals) {
      await t.rollback(transaction.data)
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
    const commit = await t.commit(transaction.data)
    if (t.isTransactionError(commit)) {
      throw ApiError.BadRequest(`Ошибка при создании пользователя`, commit.error)
    }
    
    return token
  })
  
  static update = createSlice<{
    item: Pick<IUser, 'id' | 'email' | 'name' | 'roleId'>
  } ,Pick<IUser, 'email' | 'name'>>(async ({data, options}) => {
    const transaction = options?.transaction
    
    let user = await userModel.findOne({where: {email:data.email}, transaction: transaction.data})
    
    if (!user) {
      await t.rollback(transaction.data)
      throw ApiError.BadRequest(`Ошибка при поиске пользователя`)
    }
    
    if (data.email) user.email = data.email
    if (data.name) user.name = data.name
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
      await t.rollback(transaction.data)
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
      await t.rollback(transaction.data)
      throw ApiError.BadRequest(`Пользователя с данным идентификатором не существует`)
    }
    
    const role = await roleService.getOneById({data:{id:data.roleId},options:{transaction}})
    
    userData.roleId = role.id
    const user = await userData.save({transaction: transaction.data})
    if (!user) {
      await t.rollback(transaction.data)
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
      await t.rollback(transaction.data)
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
      await t.rollback(transaction.data)
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
      await t.rollback(transaction.data)
      throw ApiError.UnauthorizedError()
    }
    
    const userData = await tokenService.validateRefreshToken({data:{token:data.refreshToken}})
    const tokenFromDB = await tokenService.getToken({data:{refreshToken:data.refreshToken},options:{transaction}})
    
    if (!userData || !tokenFromDB) throw ApiError.UnauthorizedError()
    
    const user = await userModel.findOne({where: {id: userData.id}, transaction: transaction.data})
    if (!user) {
      await t.rollback(transaction.data)
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