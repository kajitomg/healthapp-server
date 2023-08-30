import {CreationOptional, InferAttributes, InferCreationAttributes, Model} from "sequelize";

const {DBService} = require('../services/db');
const {DataTypes} = require('sequelize')

const sequalize = DBService.postgres.sequalize

interface RoleI extends Model<InferAttributes<RoleI>, InferCreationAttributes<RoleI>> {
  id: CreationOptional<number>;
  name:string,
  level:string
}
const roleModel:RoleI = sequalize.define('role',{
  id:{type:DataTypes.INTEGER, primaryKey:true, autoIncrement:true},
  name:{type:DataTypes.STRING, allowNull: false},
  level:{type:DataTypes.STRING, allowNull: false}
})

export {roleModel, RoleI}