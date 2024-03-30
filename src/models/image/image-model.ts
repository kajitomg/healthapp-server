import {CreationOptional, InferAttributes, InferCreationAttributes, Model} from "sequelize";

import {DBService} from '../../services/db';
import {DataTypes} from 'sequelize'

const sequelize = DBService.postgres.sequelize

interface IImage extends Model<InferAttributes<IImage>, InferCreationAttributes<IImage>> {
  id?: CreationOptional<number>;
  name?: string,
  path?: string,
}

const imageModel = sequelize.define<IImage>('image', {
  id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
  name: {type: DataTypes.STRING},
  path: {type: DataTypes.STRING, unique: true},
})

export {imageModel, IImage}