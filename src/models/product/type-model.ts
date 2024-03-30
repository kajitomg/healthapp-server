import {CreationOptional, InferAttributes, InferCreationAttributes, Model} from "sequelize";

import {DBService} from '../../services/db';
import {DataTypes} from 'sequelize'

const sequelize = DBService.postgres.sequelize

interface IType extends Model<InferAttributes<IType>, InferCreationAttributes<IType>> {
  id?: CreationOptional<number>;
  value?: string,
  basic?: boolean,
}

const typeModel = sequelize.define<IType>('type', {
  id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
  value: {type: DataTypes.STRING, unique: true},
  basic: {type: DataTypes.BOOLEAN, defaultValue: false},
})

export {typeModel, IType}