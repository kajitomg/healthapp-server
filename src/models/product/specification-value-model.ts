import {CreationOptional, InferAttributes, InferCreationAttributes, Model} from "sequelize";

const {DBService} = require('../../services/db');
const {DataTypes} = require('sequelize')

const sequelize = DBService.postgres.sequelize

interface ISpecificationValue extends Model<InferAttributes<ISpecificationValue>, InferCreationAttributes<ISpecificationValue>> {
  id: CreationOptional<number>;
  specificationId: CreationOptional<number>;
  valueId: CreationOptional<number>;
}

const specificationValueModel: ISpecificationValue = sequelize.define('specification-value', {
  id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
})

export {specificationValueModel, ISpecificationValue}