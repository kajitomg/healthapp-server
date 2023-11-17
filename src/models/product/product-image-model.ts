import {CreationOptional, InferAttributes, InferCreationAttributes, Model} from "sequelize";

const {DBService} = require('../../services/db');
const {DataTypes} = require('sequelize')

const sequelize = DBService.postgres.sequelize

interface ProductImageI extends Model<InferAttributes<ProductImageI>, InferCreationAttributes<ProductImageI>> {
  id: CreationOptional<number>;
  productId: CreationOptional<number>;
  imageId: CreationOptional<number>;
}

const productImageModel: ProductImageI = sequelize.define('product-image', {
  id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
})

export {productImageModel, ProductImageI}