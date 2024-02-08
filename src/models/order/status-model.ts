import {CreationOptional, InferAttributes, InferCreationAttributes, Model} from "sequelize";

const {DBService} = require('../../services/db');
const {DataTypes} = require('sequelize')

const sequelize = DBService.postgres.sequelize

interface IStatus extends Model<InferAttributes<IStatus>, InferCreationAttributes<IStatus>> {
  id: CreationOptional<number>,
  value:string
}

const statusModel: IStatus = sequelize.define('status', {
  id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
  value: {type: DataTypes.STRING, unique:true},
})

export {statusModel, IStatus}