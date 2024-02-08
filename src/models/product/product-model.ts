import {CreationOptional, InferAttributes, InferCreationAttributes, Model} from "sequelize";

const {DBService} = require('../../services/db');
const {DataTypes} = require('sequelize')

const sequelize = DBService.postgres.sequelize

interface IProduct extends Model<InferAttributes<IProduct>, InferCreationAttributes<IProduct>> {
  id?: CreationOptional<number>;
  name?: string,
  article?: string,
  price?: number,
  discount?: number,
  description?: string,
  imageId?: CreationOptional<number>
}

const productModel: IProduct = sequelize.define('product', {
  id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
  name: {type: DataTypes.STRING},
  article: {type: DataTypes.STRING},
  price: {type: DataTypes.INTEGER},
  discount: {type: DataTypes.INTEGER},
  description: {type: DataTypes.STRING},
})

export {productModel, IProduct}