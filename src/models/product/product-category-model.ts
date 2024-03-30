import {CreationOptional, InferAttributes, InferCreationAttributes, Model} from "sequelize";

import {DBService} from '../../services/db';
import {DataTypes} from 'sequelize'

const sequelize = DBService.postgres.sequelize

interface IProductCategory extends Model<InferAttributes<IProductCategory>, InferCreationAttributes<IProductCategory>> {
  id: CreationOptional<number>;
  productId?: CreationOptional<number>;
  categoryId?: CreationOptional<number>;
}

const productCategoryModel = sequelize.define<IProductCategory>('product-category', {
  id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
})

export {productCategoryModel, IProductCategory}