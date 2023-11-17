import {CreationOptional, InferAttributes, InferCreationAttributes, Model} from "sequelize";

const {DBService} = require('../../services/db');
const {DataTypes} = require('sequelize')

const sequelize = DBService.postgres.sequelize

interface ProductI extends Model<InferAttributes<ProductI>, InferCreationAttributes<ProductI>> {
  id: CreationOptional<number>;
  name: string,
  article: string,
  price: number,
  discount: number,
  description: string,
}

const productModel: ProductI = sequelize.define('product', {
  id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
  name: {type: DataTypes.STRING},
  article: {type: DataTypes.STRING},
  price: {type: DataTypes.INTEGER},
  discount: {type: DataTypes.INTEGER},
  description: {type: DataTypes.STRING},
})

export {productModel, ProductI}