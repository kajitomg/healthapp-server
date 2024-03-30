import {CreationOptional, InferAttributes, InferCreationAttributes, Model} from "sequelize";

import {DBService} from '../../services/db';
import {DataTypes} from 'sequelize'

const sequelize = DBService.postgres.sequelize

interface IOrderCustomer extends Model<InferAttributes<IOrderCustomer>, InferCreationAttributes<IOrderCustomer>> {
  id: CreationOptional<number>;
  orderId?: CreationOptional<number>;
  customerId?: CreationOptional<number>;
}

const orderCustomerModel = sequelize.define<IOrderCustomer>('order-customer', {
  id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
})

export {orderCustomerModel, IOrderCustomer}