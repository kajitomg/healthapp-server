import {CreationOptional, InferAttributes, InferCreationAttributes, Model} from "sequelize";

const {DBService} = require('../../services/db');
const {DataTypes} = require('sequelize')

const sequelize = DBService.postgres.sequelize


interface IUser extends Model<InferAttributes<IUser>, InferCreationAttributes<IUser>> {
  id: CreationOptional<number>,
  name: string,
  email: string,
  password: string,
  roleId: number,
}

const userModel: IUser = sequelize.define('user', {
  id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
  name: {type: DataTypes.STRING},
  email: {
    type: DataTypes.STRING, unique: true, allowNull: false, validate: {
      isEmail: true
    }
  },
  password: {type: DataTypes.STRING, allowNull: false}
})

export {userModel, IUser}