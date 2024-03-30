import {CreationOptional, InferAttributes, InferCreationAttributes, Model} from "sequelize";
import {ICartProduct} from "./cart-product-model";

import {DBService} from '../../services/db';
import {DataTypes} from'sequelize'

const sequelize = DBService.postgres.sequelize

interface ICart extends Model<InferAttributes<ICart>, InferCreationAttributes<ICart>> {
  id: CreationOptional<number>;
  userId?: CreationOptional<number>;
  'cart-product'?:ICartProduct;
}

const cartModel = sequelize.define<ICart>('cart', {
  id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
})

export {cartModel, ICart}