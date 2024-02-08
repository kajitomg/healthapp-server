import {productDTO} from "./product";
import {userDTO, userDTOSecure} from "./user";

class DTOService {
  static user(user, secure) {
    if(secure){
      return new userDTOSecure(user)
    }
    return new userDTO(user)
  }
  
  static product(product) {
    return new productDTO(product)
  }

}

export {DTOService}