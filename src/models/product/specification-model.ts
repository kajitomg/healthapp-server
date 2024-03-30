import {CreationOptional, InferAttributes, InferCreationAttributes, Model} from "sequelize";

import {DBService} from '../../services/db';
import {DataTypes} from 'sequelize'
import {IValue} from "./value-model";

const sequelize = DBService.postgres.sequelize

interface ISpecification extends Model<InferAttributes<ISpecification>, InferCreationAttributes<ISpecification>> {
  id?: CreationOptional<number>;
  name?: string,
  basic?: boolean,
  categoryId?: CreationOptional<number>,
  typeId?: CreationOptional<number>,
  values?:IValue[]
}

const specificationModel = sequelize.define<ISpecification>('specification', {
  id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
  name: {type: DataTypes.STRING, unique: true},
  basic: {type: DataTypes.BOOLEAN, defaultValue: false},
})

export {specificationModel, ISpecification}