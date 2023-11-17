import {userDTO} from "../dto/user";
import {MailAuthI} from "../../models/user/mail-auth-model";
import {ApiError} from "../../exceptions/api-error";
import {RoleI} from "../../models/user/role-model";
import {MyTransactionType, TransactionOptionsType} from "../../helpers/transaction";
import queriesNormalize from "../../helpers/queries-normalize";
import {UserI} from "../../models/user/user-model";

const bcrypt = require('bcrypt')
const {authDataService} = require('../auth-data');
const {tokenService} = require('../token');
const {roleService} = require('../role');
const {DTOService} = require('../dto');
const {mailAuthModel} = require('../../models');
const {userModel} = require('../../models');
const t: MyTransactionType = require('../../helpers/transaction')

class userService {
  static async create(email: string, password: string, name?: string, level?: string, queries?: any, options?: TransactionOptionsType): Promise<{
    accessToken: string,
    refreshToken: string,
    user: userDTO
  }> {//HEAD
    const transaction = options?.transaction
    
    const roleData = await roleService.getOneByLevel(level, {transaction})
    
    const registration = await this.registration(email, password, name, roleData, queries, {transaction})
    
    return {
      ...registration,
    }
    
  }
  
  static async registration(email: string, password: string, name?: string, role?: RoleI, queries?: any, options?: TransactionOptionsType): Promise<{
    accessToken: string,
    refreshToken: string,
    user: userDTO
  }> {//HEAD
    const transaction = options?.transaction
    const normalizeQueries = queriesNormalize(queries)
    
    const candidate = await userModel.findOne({where: {email}, transaction: transaction.data})
    if (candidate) {
      await t.rollback(transaction.data)
      throw ApiError.BadRequest(`Пользователь с почтовым адресом ${email} уже существует`)
    }
    
    const hashedPassword = await bcrypt.hash(password, 5)
    let user = await userModel.create({email, password: hashedPassword, name}, {transaction: transaction.data})
    if (!user) {
      await t.rollback(transaction.data)
      throw ApiError.BadRequest(`Ошибка при создании пользователя`)
    }
    
    const userdto = await this.setRole(user.id, role ? role.level : null, {transaction})
    
    await authDataService.create(userdto.id, {transaction})
    
    const tokens = tokenService.generateToken({...userdto})
    await tokenService.create(userdto.id, tokens.refreshToken, {transaction})
    
    const {count} = await this.count(normalizeQueries, {transaction})
    
    
    return {
      ...tokens,
      user: userdto,
      count
    }
    
  }
  
  static async adminLogin(email: string, password: string, options?: TransactionOptionsType): Promise<{
    accessToken: string,
    refreshToken: string,
    user: userDTO
  }> {
    const transaction = options?.transaction
    const user = await userModel.findOne({where: {email}, transaction: transaction.data})
    if (!user) {
      await t.rollback(transaction.data)
      throw ApiError.BadRequest(`Пользователь с почтовым адресом ${email} не найден`)
    }
    const role = await roleService.getOneById(user.roleId, {transaction})
    if (role.level > 300) {
      await t.rollback(transaction.data)
      throw ApiError.BadRequest(`Нет доступа к сервису`)
    }
    
    const data = await this.login(email, password, options)
    
    return data
  }
  
  static async login(email: string, password: string, options?: TransactionOptionsType): Promise<{
    accessToken: string,
    refreshToken: string,
    user: userDTO
  }> {
    const transaction = options?.transaction
    
    const user = await userModel.findOne({where: {email}, transaction: transaction.data})
    if (!user) {
      await t.rollback(transaction.data)
      throw ApiError.BadRequest(`Пользователь с почтовым адресом ${email} не найден`)
    }
    
    const isPassEquals = await bcrypt.compare(password, user.password)
    if (!isPassEquals) {
      await t.rollback(transaction.data)
      throw ApiError.BadRequest(`Неверный пароль`)
    }
    const userdto = DTOService.user(user)
    
    const tokens = await tokenService.generateToken({...userdto})
    await tokenService.saveToken(userdto.id, tokens.refreshToken, {transaction})
    
    return {
      ...tokens,
      user: userdto
    }
  }
  
  static async logout(refreshToken: string, options?: TransactionOptionsType): Promise<string> {
    const transaction = options?.transaction
    
    const token = await tokenService.removeToken(refreshToken, {transaction})
    const commit = await t.commit(transaction.data)
    if (t.isTransactionError(commit)) {
      throw ApiError.BadRequest(`Ошибка при создании пользователя`, commit.error)
    }
    
    return token
  }
  
  static async update(email: string, name?: string, options?: TransactionOptionsType): Promise<{ user: userDTO }> {
    const transaction = options?.transaction
    
    let user = await userModel.findOne({where: {email}, transaction: transaction.data})
    
    if (!user) {
      await t.rollback(transaction.data)
      throw ApiError.BadRequest(`Ошибка при поиске пользователя`)
    }
    
    if (email) user.email = email
    if (name) user.name = name
    user = await user.save({transaction: transaction.data})
    
    const userdto = new userDTO(user)
    
    return {
      user: userdto
    }
  }
  
  static async destroy(id: number, queries: any, options?: TransactionOptionsType): Promise<{ count: number }> {
    const transaction = options?.transaction
    
    const normalizeQueries = queriesNormalize(queries)
    
    const token = await tokenService.destroy(id, {transaction})
    const authData = await authDataService.destroy(id, {transaction})
    const user = await userModel.destroy({where: {id}, transaction: transaction.data})
    if (!user && !authData && !token) {
      await t.rollback(transaction.data)
      throw ApiError.BadRequest(`Ошибка при удалении пользователя`)
    }
    
    const {count} = await this.count(normalizeQueries, {transaction})
    
    return {
      count
    }
  }
  
  static async setRole(userId: number, roleLevel: string, options?: TransactionOptionsType): Promise<userDTO> {
    const transaction = options?.transaction
    
    const userData = await userModel.findOne({where: {id: userId}, transaction: transaction.data})
    
    if (!userData) {
      await t.rollback(transaction.data)
      throw ApiError.BadRequest(`Пользователя с данным идентификатором не существует`)
    }
    
    const role = await roleService.getOneByLevel(roleLevel ? roleLevel : '400', {transaction})
    
    userData.roleId = role.id
    const user = await userData.save({transaction: transaction.data})
    if (!user) {
      await t.rollback(transaction.data)
      throw ApiError.BadRequest(`Ошибка при сохранении пользователя`)
    }
    
    return DTOService.user(user)
  }
  
  static async getOneById(id: number, options?: TransactionOptionsType): Promise<UserI> {
    const transaction = options?.transaction
    
    const user = await userModel.findOne({where: {id}, transaction: transaction.data})
    if (!user) {
      await t.rollback(transaction.data)
      throw ApiError.BadRequest(`Пользователя с данным идентификатором не существует`)
    }
    
    return user
  }
  
  static async gets(queries: any, options?: TransactionOptionsType): Promise<{ users: userDTO[], count: number }> {
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
    
    const {count} = await this.count(normalizeQueries, {transaction})
    
    const result = {
      users: users.map(user => new userDTO(user)),
      count
    }
    
    if (!result.users || !result.count) {
      await t.rollback(transaction.data)
      throw ApiError.BadRequest(`Ошибка при поиске пользователей`)
    }
    
    return result
  }
  
  static async count(queries: any, options?: TransactionOptionsType): Promise<{ count: number }> {
    const transaction = options?.transaction
    
    const count = await userModel.count({
      where: {
        ...queries.searched
      },
      raw: true,
      transaction: transaction.data,
      order: queries.order
    })
    
    return {
      count
    }
  }
  
  static async activate(activateLink: string, options?: TransactionOptionsType): Promise<MailAuthI> {
    const transaction = options?.transaction
    
    const mail = await mailAuthModel.findOne({where: {url: activateLink}})
    if (!mail) {
      await t.rollback(transaction.data)
      throw ApiError.BadRequest(`Некорректная ссылка активации`)
    }
    
    mail.confirmation = true
    const mailData = await mail.save({transaction: transaction.data})
    
    return mailData
  }
  
  static async refresh(refreshToken, options?: TransactionOptionsType): Promise<{
    accessToken: string,
    refreshToken: string,
    user: userDTO
  }> {
    const transaction = options?.transaction
    
    if (!refreshToken) {
      await t.rollback(transaction.data)
      throw ApiError.UnauthorizedError()
    }
    
    const userData = tokenService.validateRefreshToken(refreshToken)
    const tokenFromDB = await tokenService.getToken(refreshToken, {transaction})
    
    if (!userData || !tokenFromDB) throw ApiError.UnauthorizedError()
    
    const user = await userModel.findOne({where: {id: userData.id}, transaction: transaction.data})
    if (!user) {
      await t.rollback(transaction.data)
      throw ApiError.BadRequest(`Не удалось найти пользователя`)
    }
    const userdto = DTOService.user(user)
    
    const tokens = tokenService.generateToken({...userdto})
    await tokenService.saveToken(userdto.id, tokens.refreshToken, {transaction})
    
    return {
      ...tokens,
      user: userdto
    }
  }
  
}

export {userService}