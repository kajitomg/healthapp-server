import {CreationOptional, InferAttributes, InferCreationAttributes, Model} from "sequelize";

const {DBService} = require('../../services/db');
const {DataTypes} = require('sequelize')

const sequelize = DBService.postgres.sequelize

interface ProductValueI extends Model<InferAttributes<ProductValueI>, InferCreationAttributes<ProductValueI>> {
  id: CreationOptional<number>;
  productId: CreationOptional<number>;
  valueId: CreationOptional<number>;
}

const productValueModel: ProductValueI = sequelize.define('product-value', {
  id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
})

export {productValueModel, ProductValueI}