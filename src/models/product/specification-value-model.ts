import {CreationOptional, InferAttributes, InferCreationAttributes, Model} from "sequelize";

const {DBService} = require('../../services/db');
const {DataTypes} = require('sequelize')

const sequelize = DBService.postgres.sequelize

interface SpecificationValueI extends Model<InferAttributes<SpecificationValueI>, InferCreationAttributes<SpecificationValueI>> {
  id: CreationOptional<number>;
  specificationId: CreationOptional<number>;
  valueId: CreationOptional<number>;
}

const specificationValueModel: SpecificationValueI = sequelize.define('specification-value', {
  id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
})

export {specificationValueModel, SpecificationValueI}