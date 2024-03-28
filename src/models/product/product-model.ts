import {CreationOptional, InferAttributes, InferCreationAttributes, Model} from "sequelize";
import {ICartProduct} from "../cart/cart-product-model";
import {ILikeProduct} from "../like/like-product-model";
import {ICart} from "../cart/cart-model";
import {ILike} from "../like/like-model";

const {DBService} = require('../../services/db');
const {DataTypes} = require('sequelize')

const sequelize = DBService.postgres.sequelize

interface IProduct extends Model<InferAttributes<IProduct>, InferCreationAttributes<IProduct>> {
  id?: CreationOptional<number>;
  name?: string,
  article?: string,
  price?: number,
  discount?: number,
  description?: string,
  imageId?: CreationOptional<number>,
  count?: number,
  'cart-product':ICartProduct,
  'like-product':ILikeProduct,
  carts:ICart,
  likes:ILike
}

const productModel: IProduct = sequelize.define('product', {
  id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
  name: {type: DataTypes.STRING},
  article: {type: DataTypes.STRING},
  price: {type: DataTypes.INTEGER},
  discount: {type: DataTypes.INTEGER},
  description: {type: DataTypes.STRING},
  count: {type:DataTypes.INTEGER}
})

export {productModel, IProduct}