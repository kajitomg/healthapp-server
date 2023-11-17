import {CreationOptional, InferAttributes, InferCreationAttributes, Model} from "sequelize";

const {DBService} = require('../../services/db');
const {DataTypes} = require('sequelize')

const sequelize = DBService.postgres.sequelize

interface ProductDocumentI extends Model<InferAttributes<ProductDocumentI>, InferCreationAttributes<ProductDocumentI>> {
  id: CreationOptional<number>;
  productId: CreationOptional<number>;
  documentId: CreationOptional<number>;
}

const productDocumentModel: ProductDocumentI = sequelize.define('product-document', {
  id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
})

export {productDocumentModel, ProductDocumentI}