import {CreationOptional, InferAttributes, InferCreationAttributes, Model} from "sequelize";

const {DBService} = require('../../services/db');
const {DataTypes} = require('sequelize')

const sequelize = DBService.postgres.sequelize

interface IOrder extends Model<InferAttributes<IOrder>, InferCreationAttributes<IOrder>> {
  id: CreationOptional<number>,
  customerId: CreationOptional<number>,
  phonenumber:string,
  comment:string,
  statusId:CreationOptional<number>,
}

const orderModel: IOrder = sequelize.define('order', {
  id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
  phonenumber:{type: DataTypes.STRING},
  comment:{type: DataTypes.STRING},
})

export {orderModel, IOrder}