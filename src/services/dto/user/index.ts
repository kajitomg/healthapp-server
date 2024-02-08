import {IUser} from "../../../models/user/user-model";

class userDTO {
  public id:number
  public name:string
  public email:string
  public roleId:number
  
  constructor(user:IUser) {
    this.id = user.id
    this.name = user.name
    this.email = user.email
    this.roleId = user.roleId
  }
}

class userDTOSecure extends userDTO{
  public password:string
  
  constructor(user:IUser) {
    super(user);
    this.password = user.password
  }
  
}

export {userDTO,userDTOSecure}