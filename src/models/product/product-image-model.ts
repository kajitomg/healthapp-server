import {CreationOptional, InferAttributes, InferCreationAttributes, Model} from "sequelize";

const {DBService} = require('../../services/db');
const {DataTypes} = require('sequelize')

const sequelize = DBService.postgres.sequelize

interface IProductImage extends Model<InferAttributes<IProductImage>, InferCreationAttributes<IProductImage>> {
  id: CreationOptional<number>;
  productId: CreationOptional<number>;
  imageId: CreationOptional<number>;
}

const productImageModel: IProductImage = sequelize.define('product-image', {
  id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
})

export {productImageModel, IProductImage}