import {CreationOptional, InferAttributes, InferCreationAttributes, Model} from "sequelize";

const {DBService} = require('../../services/db');
const {DataTypes} = require('sequelize')

const sequelize = DBService.postgres.sequelize

interface ValueI extends Model<InferAttributes<ValueI>, InferCreationAttributes<ValueI>> {
  id: CreationOptional<number>;
  value: string,
  basic: boolean,
}

const valueModel: ValueI = sequelize.define('value', {
  id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
  value: {type: DataTypes.STRING, unique: true},
  basic: {type: DataTypes.BOOLEAN, defaultValue: false},
})

export {valueModel, ValueI}