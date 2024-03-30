import {CreationOptional, InferAttributes, InferCreationAttributes, Model} from "sequelize";

import {DBService} from '../../services/db';
import {DataTypes} from 'sequelize'

const sequelize = DBService.postgres.sequelize

interface IOrderProduct extends Model<InferAttributes<IOrderProduct>, InferCreationAttributes<IOrderProduct>> {
  id: CreationOptional<number>;
  orderId?: CreationOptional<number>;
  productId?: CreationOptional<number>;
  count:number
}

const orderProductModel = sequelize.define<IOrderProduct>('order-product', {
  id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
  count:{type:DataTypes.INTEGER}
})

export {orderProductModel, IOrderProduct}