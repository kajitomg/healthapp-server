import {CreationOptional, InferAttributes, InferCreationAttributes, Model} from "sequelize";

import {DBService} from '../../services/db';
import {DataTypes} from 'sequelize'

const sequelize = DBService.postgres.sequelize

interface IMailAuth extends Model<InferAttributes<IMailAuth>, InferCreationAttributes<IMailAuth>> {
  id: CreationOptional<number>;
  url: string,
  confirmation: boolean
}

const mailAuthModel = sequelize.define<IMailAuth>('mail-auth', {
  id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
  url: {type: DataTypes.STRING},
  confirmation: {type: DataTypes.BOOLEAN, defaultValue: false},
})

export {mailAuthModel, IMailAuth}