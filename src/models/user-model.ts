import {CreationOptional, InferAttributes, InferCreationAttributes, Model} from "sequelize";

const {DBService} = require('../services/db');
const {DataTypes} = require('sequelize')

const sequalize = DBService.postgres.sequalize
interface UserI extends Model<InferAttributes<UserI>, InferCreationAttributes<UserI>> {
  id: CreationOptional<number>;
  name:string,
  email:string,
  password:string
}
const userModel:UserI = sequalize.define('user',{
  id:{type:DataTypes.INTEGER, primaryKey:true, autoIncrement:true},
  name:{type:DataTypes.STRING,},
  email:{type:DataTypes.STRING, unique:true, allowNull: false, validate:{
      isEmail:true
    }},
  password:{type:DataTypes.STRING, allowNull: false}
})

export {userModel,UserI}