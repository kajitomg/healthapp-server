const {userModel} = require('./user-model')
const {authDataModel} = require('./auth-data-model')
const {roleModel} = require('./role-model')
const {mailAuthModel} = require('./mail-auth-model')
const {tokenModel} = require('./token-model')

userModel.hasOne(authDataModel)
authDataModel.belongsTo(userModel)

roleModel.hasMany(userModel)
userModel.belongsTo(roleModel)

mailAuthModel.hasOne(authDataModel)
authDataModel.belongsTo(mailAuthModel)

userModel.hasOne(tokenModel)
tokenModel.belongsTo(userModel)

export {userModel, authDataModel, roleModel, mailAuthModel, tokenModel}