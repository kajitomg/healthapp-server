import {CreationOptional, InferAttributes, InferCreationAttributes, Model} from "sequelize";

const {DBService} = require('../../services/db');
const {DataTypes} = require('sequelize')

const sequelize = DBService.postgres.sequelize

interface SpecificationI extends Model<InferAttributes<SpecificationI>, InferCreationAttributes<SpecificationI>> {
  id: CreationOptional<number>;
  name: string,
  basic: boolean,
  categoryId: CreationOptional<number>;
  typeId: CreationOptional<number>;
}

const specificationModel: SpecificationI = sequelize.define('specification', {
  id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
  name: {type: DataTypes.STRING, unique: true},
  basic: {type: DataTypes.BOOLEAN, defaultValue: false},
})

export {specificationModel, SpecificationI}