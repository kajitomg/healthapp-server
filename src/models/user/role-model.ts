import {CreationOptional, InferAttributes, InferCreationAttributes, Model} from "sequelize";

import {DBService} from '../../services/db';
import {DataTypes} from 'sequelize'

const sequelize = DBService.postgres.sequelize

interface IRole extends Model<InferAttributes<IRole>, InferCreationAttributes<IRole>> {
  id: CreationOptional<number>;
  name: string,
  level: string
}

const roleModel = sequelize.define<IRole>('role', {
  id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
  name: {type: DataTypes.STRING, allowNull: false},
  level: {type: DataTypes.STRING, allowNull: false}
})

export {roleModel, IRole}