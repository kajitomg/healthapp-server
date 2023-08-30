import {CreationOptional, InferAttributes, InferCreationAttributes, Model} from "sequelize";

const {DBService} = require('../services/db');
const {DataTypes} = require('sequelize')

const sequalize = DBService.postgres.sequalize

interface TokenI extends Model<InferAttributes<TokenI>, InferCreationAttributes<TokenI>> {
  id: CreationOptional<number>;
  refresh: string,
  userId: CreationOptional<number>;
}
const tokenModel:TokenI = sequalize.define('token',{
  id:{type:DataTypes.INTEGER, primaryKey:true, autoIncrement:true},
  refresh:{type:DataTypes.STRING},
})

export {tokenModel, TokenI}