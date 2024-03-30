import {CreationOptional, InferAttributes, InferCreationAttributes, Model} from "sequelize";

import {DBService} from '../../services/db';
import {DataTypes} from 'sequelize'

const sequelize = DBService.postgres.sequelize

interface IStatus extends Model<InferAttributes<IStatus>, InferCreationAttributes<IStatus>> {
  id: CreationOptional<number>,
  value:string
}

const statusModel = sequelize.define<IStatus>('status', {
  id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
  value: {type: DataTypes.STRING, unique:true},
})

export {statusModel, IStatus}