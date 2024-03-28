import {CreationOptional, InferAttributes, InferCreationAttributes, Model} from "sequelize";

const {DBService} = require('../../services/db');
const {DataTypes} = require('sequelize')

const sequelize = DBService.postgres.sequelize

interface IOrderCustomer extends Model<InferAttributes<IOrderCustomer>, InferCreationAttributes<IOrderCustomer>> {
  id: CreationOptional<number>;
  orderId: CreationOptional<number>;
  customerId: CreationOptional<number>;
}

const orderCustomerModel: IOrderCustomer = sequelize.define('order-customer', {
  id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
})

export {orderCustomerModel, IOrderCustomer}