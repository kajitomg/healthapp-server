import {CreationOptional, InferAttributes, InferCreationAttributes, Model} from "sequelize";

const {DBService} = require('../../services/db');
const {DataTypes} = require('sequelize')

const sequelize = DBService.postgres.sequelize

interface TypeI extends Model<InferAttributes<TypeI>, InferCreationAttributes<TypeI>> {
  id: CreationOptional<number>;
  value: string,
  basic: boolean,
}

const typeModel: TypeI = sequelize.define('type', {
  id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
  value: {type: DataTypes.STRING, unique: true},
  basic: {type: DataTypes.BOOLEAN, defaultValue: false},
})

export {typeModel, TypeI}