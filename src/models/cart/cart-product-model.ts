import {CreationOptional, InferAttributes, InferCreationAttributes, Model} from "sequelize";

import {DBService} from '../../services/db';
import {DataTypes} from 'sequelize'

const sequelize = DBService.postgres.sequelize

interface ICartProduct extends Model<InferAttributes<ICartProduct>, InferCreationAttributes<ICartProduct>> {
  id: CreationOptional<number>;
  cartId?: CreationOptional<number>;
  productId?: CreationOptional<number>;
  count:number
}

const cartProductModel = sequelize.define<ICartProduct>('cart-product', {
  id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
  count:{type:DataTypes.INTEGER}
})

export {cartProductModel, ICartProduct}