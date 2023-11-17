import {CreationOptional, InferAttributes, InferCreationAttributes, Model} from "sequelize";

const {DBService} = require('../../services/db');
const {DataTypes} = require('sequelize')

const sequelize = DBService.postgres.sequelize

interface ImageI extends Model<InferAttributes<ImageI>, InferCreationAttributes<ImageI>> {
  id: CreationOptional<number>;
  name: string,
  path: string,
}

const imageModel: ImageI = sequelize.define('image', {
  id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
  name: {type: DataTypes.STRING},
  path: {type: DataTypes.STRING, unique: true},
})

export {imageModel, ImageI}