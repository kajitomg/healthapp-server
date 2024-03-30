import {CreationOptional, InferAttributes, InferCreationAttributes, Model} from "sequelize";

import {DBService} from '../../services/db';
import {DataTypes} from 'sequelize'

const sequelize = DBService.postgres.sequelize

interface IProductSpecification extends Model<InferAttributes<IProductSpecification>, InferCreationAttributes<IProductSpecification>> {
  id: CreationOptional<number>;
  value:string,
  productId?: CreationOptional<number>;
  specificationId?: CreationOptional<number>;
}

const productSpecificationModel = sequelize.define<IProductSpecification>('product-specification', {
  id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
  value: {type: DataTypes.STRING},
})

export {productSpecificationModel, IProductSpecification}