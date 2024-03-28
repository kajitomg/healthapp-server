import {CreationOptional, InferAttributes, InferCreationAttributes, Model} from "sequelize";

const {DBService} = require('../../services/db');
const {DataTypes} = require('sequelize')

const sequelize = DBService.postgres.sequelize

interface ICartProduct extends Model<InferAttributes<ICartProduct>, InferCreationAttributes<ICartProduct>> {
  id: CreationOptional<number>;
  cartId: CreationOptional<number>;
  productId: CreationOptional<number>;
  count:number
}

const cartProductModel: ICartProduct = sequelize.define('cart-product', {
  id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
  count:{type:DataTypes.INTEGER}
})

export {cartProductModel, ICartProduct}