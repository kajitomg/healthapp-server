import {CreationOptional, InferAttributes, InferCreationAttributes, Model} from "sequelize";

const {DBService} = require('../services/db');
const {DataTypes} = require('sequelize')

const sequalize = DBService.postgres.sequalize

interface AuthDataI extends Model<InferAttributes<AuthDataI>, InferCreationAttributes<AuthDataI>> {
  id: CreationOptional<number>;
  userId: CreationOptional<number>,
  mailAuthId: CreationOptional<number>
}

const authDataModel:AuthDataI = sequalize.define('auth-data',{
  id:{type:DataTypes.INTEGER, primaryKey:true, autoIncrement:true}
})

export {authDataModel, AuthDataI}