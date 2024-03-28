import {CreationOptional, InferAttributes, InferCreationAttributes, Model} from "sequelize";

const {DBService} = require('../../services/db');
const {DataTypes} = require('sequelize')

const sequelize = DBService.postgres.sequelize

interface ILikeProduct extends Model<InferAttributes<ILikeProduct>, InferCreationAttributes<ILikeProduct>> {
  id: CreationOptional<number>;
  likeId: CreationOptional<number>;
  productId: CreationOptional<number>;
}

const likeProductModel: ILikeProduct = sequelize.define('like-product', {
  id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
})

export {likeProductModel, ILikeProduct}