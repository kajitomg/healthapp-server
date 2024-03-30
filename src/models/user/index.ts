import {userModel} from './user-model'
import {authDataModel} from './auth-data-model'
import {roleModel} from './role-model'
import {mailAuthModel} from './mail-auth-model'
import {tokenModel} from './token-model'

userModel.hasOne(authDataModel)
authDataModel.belongsTo(userModel)

roleModel.hasMany(userModel)
userModel.belongsTo(roleModel)

mailAuthModel.hasOne(authDataModel)
authDataModel.belongsTo(mailAuthModel)

userModel.hasOne(tokenModel)
tokenModel.belongsTo(userModel)

export default {userModel, authDataModel, roleModel, mailAuthModel, tokenModel}