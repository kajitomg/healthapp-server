import {CreationOptional, InferAttributes, InferCreationAttributes, Model} from "sequelize";

const {DBService} = require('../../services/db');
const {DataTypes} = require('sequelize')

const sequelize = DBService.postgres.sequelize

interface AuthDataI extends Model<InferAttributes<AuthDataI>, InferCreationAttributes<AuthDataI>> {
  id: CreationOptional<number>;
  userId: CreationOptional<number>,
  mailAuthId: CreationOptional<number>
}

const authDataModel: AuthDataI = sequelize.define('auth-data', {
  id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true}
})

export {authDataModel, AuthDataI}