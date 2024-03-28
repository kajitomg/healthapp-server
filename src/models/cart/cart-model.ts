import {CreationOptional, InferAttributes, InferCreationAttributes, Model} from "sequelize";
import {ICartProduct} from "./cart-product-model";
import {IProduct} from "../product/product-model";

const {DBService} = require('../../services/db');
const {DataTypes} = require('sequelize')

const sequelize = DBService.postgres.sequelize

interface ICart extends Model<InferAttributes<ICart>, InferCreationAttributes<ICart>> {
  id: CreationOptional<number>;
  userId: CreationOptional<number>;
  'cart-product':ICartProduct;
}

const cartModel: ICart = sequelize.define('cart', {
  id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
})

export {cartModel, ICart}