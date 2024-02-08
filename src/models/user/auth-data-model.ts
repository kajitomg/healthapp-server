import {CreationOptional, InferAttributes, InferCreationAttributes, Model} from "sequelize";

const {DBService} = require('../../services/db');
const {DataTypes} = require('sequelize')

const sequelize = DBService.postgres.sequelize

interface IAuthData extends Model<InferAttributes<IAuthData>, InferCreationAttributes<IAuthData>> {
  id: CreationOptional<number>;
  userId: CreationOptional<number>,
  mailAuthId: CreationOptional<number>
}

const authDataModel: IAuthData = sequelize.define('auth-data', {
  id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true}
})

export {authDataModel, IAuthData}