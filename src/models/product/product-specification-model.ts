import {CreationOptional, InferAttributes, InferCreationAttributes, Model} from "sequelize";

const {DBService} = require('../../services/db');
const {DataTypes} = require('sequelize')

const sequelize = DBService.postgres.sequelize

interface ProductSpecificationI extends Model<InferAttributes<ProductSpecificationI>, InferCreationAttributes<ProductSpecificationI>> {
  id: CreationOptional<number>;
  productId: CreationOptional<number>;
  specificationId: CreationOptional<number>;
}

const productSpecificationModel: ProductSpecificationI = sequelize.define('product-specification', {
  id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
})

export {productSpecificationModel, ProductSpecificationI}