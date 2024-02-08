import {CreationOptional, InferAttributes, InferCreationAttributes, Model} from "sequelize";

const {DBService} = require('../../services/db');
const {DataTypes} = require('sequelize')

const sequelize = DBService.postgres.sequelize

interface IImage extends Model<InferAttributes<IImage>, InferCreationAttributes<IImage>> {
  id?: CreationOptional<number>;
  name?: string,
  path?: string,
}

const imageModel: IImage = sequelize.define('image', {
  id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
  name: {type: DataTypes.STRING},
  path: {type: DataTypes.STRING, unique: true},
})

export {imageModel, IImage}