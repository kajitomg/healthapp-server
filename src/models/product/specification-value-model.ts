import {CreationOptional, InferAttributes, InferCreationAttributes, Model} from "sequelize";

import {DBService} from '../../services/db';
import {DataTypes} from 'sequelize'

const sequelize = DBService.postgres.sequelize

interface ISpecificationValue extends Model<InferAttributes<ISpecificationValue>, InferCreationAttributes<ISpecificationValue>> {
  id: CreationOptional<number>;
  specificationId?: CreationOptional<number>;
  valueId?: CreationOptional<number>;
}

const specificationValueModel = sequelize.define<ISpecificationValue>('specification-value', {
  id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
})

export {specificationValueModel, ISpecificationValue}