import {roleModel} from "../../models";
import {IRole} from "../../models/user/role-model";
import {ApiError} from "../../exceptions/api-error";
import {MyTransactionType} from "../../helpers/transaction";
import createSlice from "../../helpers/create-slice";

const t: MyTransactionType = require('../../helpers/transaction')

class roleService {
  static create = createSlice<IRole,Pick<IRole, 'name' | 'level'>>(async ({data, options}) => {
    const transaction = options?.transaction
    
    const roleData = await roleModel.findOne({where: {level:data.level}, transaction: transaction.data})
    if (roleData) {
      throw ApiError.BadRequest(`Роль с уровнем доступа ${data.level} уже существует`)
    }
    const role = await roleModel.create(data, {transaction: transaction.data})
    if (!role) {
      throw ApiError.BadRequest(`Ошибка при создании пользователя`)
    }
    return role
  })
  
  static getOneById = createSlice<IRole,Pick<IRole, 'id'>>(async ({data, options}) => {
    
    const transaction = options?.transaction
    const roleData = await roleModel.findOne({where: data, transaction: transaction.data})
    
    if (!roleData) {
      await t.rollback(transaction.data)
      throw ApiError.BadRequest(`Роли не существует`)
    }
    
    return roleData
  })
  
  static getOneByLevel = createSlice<IRole,Pick<IRole, 'level'>>(async ({data, options}) => {
    const transaction = options?.transaction
    
    const roleData = await roleModel.findOne({where: data, transaction: transaction.data})
    if (!roleData) {
      await t.rollback(transaction.data)
      throw ApiError.BadRequest(`Роли не существует`)
    }
    
    return roleData
  })
  
  static getAll = createSlice<{list:IRole[]}>(async ({options}) => {
    const transaction = options?.transaction
    
    const roleData = await roleModel.findAll()
    if (!roleData) {
      await t.rollback(transaction.data)
      throw ApiError.BadRequest(`Роли не существует`)
    }
    
    return {
      list:roleData
    }
  })
}

export {roleService}