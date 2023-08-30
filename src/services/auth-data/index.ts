import mailService from "../mail";
import {authDataModel} from "../../models";
import {userService} from "../user";
import {AuthDataI} from "../../models/auth-data-model";

class authDataService {
  
  static async create(userId:number):Promise<AuthDataI> {
    const user = await userService.getOneId(userId)
    const mailAuth = await mailService.create()
    
    await mailService.sendActivationLink(user.email, `${process.env.API_URL}/api/user/activate/${mailAuth.url}`)
    
    return await authDataModel.create({userId,mailAuthId:mailAuth.id})
  }
  
}
export {authDataService}