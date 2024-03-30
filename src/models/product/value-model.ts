import {CreationOptional, InferAttributes, InferCreationAttributes, Model} from "sequelize";

import {DBService} from '../../services/db';
import {DataTypes} from 'sequelize'

const sequelize = DBService.postgres.sequelize

interface IValue extends Model<InferAttributes<IValue>, InferCreationAttributes<IValue>> {
  id?: CreationOptional<number>;
  value?: string,
  basic?: boolean,
}

const valueModel = sequelize.define<IValue>('value', {
  id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
  value: {type: DataTypes.STRING, unique: true},
  basic: {type: DataTypes.BOOLEAN, defaultValue: false},
})

export {valueModel, IValue}