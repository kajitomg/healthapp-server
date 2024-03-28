import {CreationOptional, InferAttributes, InferCreationAttributes, Model} from "sequelize";
import {ILikeProduct} from "./like-product-model";

const {DBService} = require('../../services/db');
const {DataTypes} = require('sequelize')

const sequelize = DBService.postgres.sequelize

interface ILike extends Model<InferAttributes<ILike>, InferCreationAttributes<ILike>> {
  id: CreationOptional<number>;
  userId: CreationOptional<number>;
  'like-product':ILikeProduct;
}

const likeModel: ILike = sequelize.define('like', {
  id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
})

export {likeModel, ILike}