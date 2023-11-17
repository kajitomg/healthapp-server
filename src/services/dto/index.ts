import {productDTO} from "./product";
import {userDTO} from "./user";

class DTOService {
  static user(user) {
    return new userDTO(user)
  }
  
  static product(product) {
    return new productDTO(product)
  }
}

export {DTOService}