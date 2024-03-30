import {CreationOptional, InferAttributes, InferCreationAttributes, Model} from "sequelize";

import {DBService} from '../../services/db';
import {DataTypes} from 'sequelize'

const sequelize = DBService.postgres.sequelize

interface IProductImage extends Model<InferAttributes<IProductImage>, InferCreationAttributes<IProductImage>> {
  id: CreationOptional<number>;
  productId?: CreationOptional<number>;
  imageId?: CreationOptional<number>;
}

const productImageModel = sequelize.define<IProductImage>('product-image', {
  id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
})

export {productImageModel, IProductImage}