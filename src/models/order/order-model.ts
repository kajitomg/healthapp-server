import {CreationOptional, InferAttributes, InferCreationAttributes, Model} from "sequelize";
import {IProduct} from "../product/product-model";

import {DBService} from '../../services/db';
import {DataTypes} from 'sequelize'

const sequelize = DBService.postgres.sequelize

interface IOrder extends Model<InferAttributes<IOrder>, InferCreationAttributes<IOrder>> {
  id: CreationOptional<number>,
  customerId?: CreationOptional<number>,
  phonenumber:string,
  email:string,
  comment:string,
  statusId?:CreationOptional<number>,
  products?:IProduct[]
}

const orderModel = sequelize.define<IOrder>('order', {
  id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
  phonenumber:{type: DataTypes.STRING},
  email: {
    type: DataTypes.STRING, validate: {
      isEmail: true
    }
  },
  comment:{type: DataTypes.STRING},
})

export {orderModel, IOrder}