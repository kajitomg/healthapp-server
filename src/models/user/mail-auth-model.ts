import {CreationOptional, InferAttributes, InferCreationAttributes, Model} from "sequelize";

const {DBService} = require('../../services/db');
const {DataTypes} = require('sequelize')

const sequelize = DBService.postgres.sequelize

interface IMailAuth extends Model<InferAttributes<IMailAuth>, InferCreationAttributes<IMailAuth>> {
  id: CreationOptional<number>;
  url: string,
  confirmation: boolean
}

const mailAuthModel: IMailAuth = sequelize.define('mail-auth', {
  id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
  url: {type: DataTypes.STRING},
  confirmation: {type: DataTypes.BOOLEAN, defaultValue: false},
})

export {mailAuthModel, IMailAuth}