import {userDTO} from "./user";

class DTOService {
  static user(user) {
    return new userDTO(user)
  }
}

export {DTOService}