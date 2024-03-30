import {CreationOptional, InferAttributes, InferCreationAttributes, Model} from "sequelize";

import {DBService} from '../../services/db';
import {DataTypes} from 'sequelize'

const sequelize = DBService.postgres.sequelize

interface IAuthData extends Model<InferAttributes<IAuthData>, InferCreationAttributes<IAuthData>> {
  id: CreationOptional<number>;
  userId?: CreationOptional<number>,
  mailAuthId?: CreationOptional<number>
}

const authDataModel = sequelize.define<IAuthData>('auth-data', {
  id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true}
})

export {authDataModel, IAuthData}