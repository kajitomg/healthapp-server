import {CreationOptional, InferAttributes, InferCreationAttributes, Model} from "sequelize";

const {DBService} = require('../../services/db');
const {DataTypes} = require('sequelize')

const sequelize = DBService.postgres.sequelize

interface ISpecification extends Model<InferAttributes<ISpecification>, InferCreationAttributes<ISpecification>> {
  id?: CreationOptional<number>;
  name?: string,
  basic?: boolean,
  categoryId?: CreationOptional<number>;
  typeId?: CreationOptional<number>;
}

const specificationModel: ISpecification = sequelize.define('specification', {
  id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
  name: {type: DataTypes.STRING, unique: true},
  basic: {type: DataTypes.BOOLEAN, defaultValue: false},
})

export {specificationModel, ISpecification}