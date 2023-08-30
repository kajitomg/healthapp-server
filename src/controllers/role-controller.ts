import {roleService} from "../services/role";


class roleController {
  
  static async create(req, res, next) {
    try {
      await roleService.create('100', 'CREATOR')
      return res.status(200).json({text:'Роль успешно создана'})
    }catch (e) {
      next(e)
    }
  }
}

export {roleController}