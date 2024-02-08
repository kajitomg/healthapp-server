import {CreationOptional, InferAttributes, InferCreationAttributes, Model} from "sequelize";

const {DBService} = require('../../services/db');
const {DataTypes} = require('sequelize')

const sequelize = DBService.postgres.sequelize

interface IOrderProduct extends Model<InferAttributes<IOrderProduct>, InferCreationAttributes<IOrderProduct>> {
  id: CreationOptional<number>;
  orderId: CreationOptional<number>;
  productId: CreationOptional<number>;
}

const orderProductModel: IOrderProduct = sequelize.define('order-product', {
  id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
})

export {orderProductModel, IOrderProduct}