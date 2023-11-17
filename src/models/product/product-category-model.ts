import {CreationOptional, InferAttributes, InferCreationAttributes, Model} from "sequelize";

const {DBService} = require('../../services/db');
const {DataTypes} = require('sequelize')

const sequelize = DBService.postgres.sequelize

interface ProductCategoryI extends Model<InferAttributes<ProductCategoryI>, InferCreationAttributes<ProductCategoryI>> {
  id: CreationOptional<number>;
  productId: CreationOptional<number>;
  categoryId: CreationOptional<number>;
}

const productCategoryModel: ProductCategoryI = sequelize.define('product-category', {
  id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
})

export {productCategoryModel, ProductCategoryI}