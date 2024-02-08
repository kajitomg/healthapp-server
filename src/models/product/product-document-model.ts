import {CreationOptional, InferAttributes, InferCreationAttributes, Model} from "sequelize";

const {DBService} = require('../../services/db');
const {DataTypes} = require('sequelize')

const sequelize = DBService.postgres.sequelize

interface IProductDocument extends Model<InferAttributes<IProductDocument>, InferCreationAttributes<IProductDocument>> {
  id: CreationOptional<number>;
  productId: CreationOptional<number>;
  documentId: CreationOptional<number>;
}

const productDocumentModel: IProductDocument = sequelize.define('product-document', {
  id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
})

export {productDocumentModel, IProductDocument}