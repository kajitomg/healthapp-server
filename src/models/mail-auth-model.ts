import {CreationOptional, InferAttributes, InferCreationAttributes, Model} from "sequelize";

const {DBService} = require('../services/db');
const {DataTypes} = require('sequelize')

const sequalize = DBService.postgres.sequalize

interface MailAuthI extends Model<InferAttributes<MailAuthI>, InferCreationAttributes<MailAuthI>> {
  id: CreationOptional<number>;
  url:string,
  confirmation:boolean
}
const mailAuthModel:MailAuthI = sequalize.define('mail-auth',{
  id:{type:DataTypes.INTEGER, primaryKey:true, autoIncrement:true},
  url:{type:DataTypes.STRING},
  confirmation:{type:DataTypes.BOOLEAN, defaultValue:false},
})

export {mailAuthModel,MailAuthI}