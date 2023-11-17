import {CreationOptional, InferAttributes, InferCreationAttributes, Model} from "sequelize";

const {DBService} = require('../../services/db');
const {DataTypes} = require('sequelize')

const sequelize = DBService.postgres.sequelize

interface RoleI extends Model<InferAttributes<RoleI>, InferCreationAttributes<RoleI>> {
  id: CreationOptional<number>;
  name: string,
  level: string
}

const roleModel: RoleI = sequelize.define('role', {
  id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
  name: {type: DataTypes.STRING, allowNull: false},
  level: {type: DataTypes.STRING, allowNull: false}
})

export {roleModel, RoleI}