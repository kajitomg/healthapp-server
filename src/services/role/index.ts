import {roleModel} from "../../models";
import {RoleI} from "../../models/role-model";
import {ApiError} from "../../exceptions/api-error";


class roleService {
  static async create(level:string, name:string):Promise<RoleI> {
    const roleData = await roleModel.findOne({where:{level}})
    if (roleData) throw ApiError.BadRequest(`Роль с уровнем доступа ${level} уже существует`)
    
    return await roleModel.create({name,level})
  }
  
  static async getOneId(id:number):Promise<RoleI> {
    const roleData = await roleModel.findOne({where:{id}})
    if (!roleData) throw ApiError.BadRequest(`Роли не существует`)
    
    return roleData
  }
  static async getOneLevel(level:string):Promise<RoleI> {
    const roleData = await roleModel.findOne({where:{level}})
    if (!roleData) throw ApiError.BadRequest(`Роли не существует`)
    
    return roleData
  }
}

export {roleService}