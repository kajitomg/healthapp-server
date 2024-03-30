import {CreationOptional, InferAttributes, InferCreationAttributes, Model} from "sequelize";

import {DBService} from '../../services/db';
import {DataTypes} from 'sequelize'

const sequelize = DBService.postgres.sequelize

interface IProductDocument extends Model<InferAttributes<IProductDocument>, InferCreationAttributes<IProductDocument>> {
  id: CreationOptional<number>;
  productId?: CreationOptional<number>;
  documentId?: CreationOptional<number>;
}

const productDocumentModel = sequelize.define<IProductDocument>('product-document', {
  id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
})

export {productDocumentModel, IProductDocument}