import mailService from "../mail";
import {userService} from "../user";
import {authDataModel, IAuthData} from "../../models/user/auth-data-model";
import {ApiError} from "../../exceptions/api-error";
import createSlice from "../../helpers/create-slice";





class authDataService {
  
  static create = createSlice<{
    item:IAuthData
  },{userId: number}>(async ({data, options}) => {
    const transaction = options?.transaction
    
    const user = await userService.getOneById({data:{id:data.userId}, options:{transaction}})
    const mailAuth = await mailService.create({options:{transaction}})

    await mailService.sendActivationLink({data:{to:user.item.email, url:`${process.env.API_URL}/api/user/activate/${mailAuth.item.url}`}, options:{transaction}})
    
    const authdata = await authDataModel.create({userId:data.userId, mailAuthId: mailAuth.item.id}, {transaction: transaction.data})
    if (!authdata) {
      throw ApiError.BadRequest(`Ошибка при создании пользователя`)
    }
    return {
      item:authdata
    }
    
  })
  
  static get = createSlice<{
    item:IAuthData
  },{userId: number}>(async ({data, options}) => {
    const transaction = options?.transaction
    
    const authdata = await authDataModel.findOne({where:{userId:data.userId},transaction: transaction.data})
    
    if (!authdata) {
      throw ApiError.BadRequest(`Ошибка при поиске данных авторизации`)
    }
    return {
      item:authdata
    }
    
  })
  
  static destroy = createSlice<number,{userId: number}>(async ({data, options}) => {
    const transaction = options?.transaction
    
    const authdata = await authDataModel.findOne({where: data, transaction: transaction.data})
    
    const mailAuth = await mailService.destroy({data:{id:authdata.mailAuthId}, options:{transaction}})
    const isAuthdata = await authDataModel.destroy({where: data, transaction: transaction.data})
    
    if (!isAuthdata && !mailAuth) {
      throw ApiError.BadRequest(`Ошибка при удалении пользователя`)
    }
    
    return mailAuth
  })
  
}

export {authDataService}