import {CreationOptional, InferAttributes, InferCreationAttributes, Model} from "sequelize";

const {DBService} = require('../../services/db');
const {DataTypes} = require('sequelize')

const sequelize = DBService.postgres.sequelize

interface IRole extends Model<InferAttributes<IRole>, InferCreationAttributes<IRole>> {
  id: CreationOptional<number>;
  name: string,
  level: string
}

const roleModel: IRole = sequelize.define('role', {
  id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
  name: {type: DataTypes.STRING, allowNull: false},
  level: {type: DataTypes.STRING, allowNull: false}
})

export {roleModel, IRole}