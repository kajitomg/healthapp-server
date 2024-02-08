import {CreationOptional, InferAttributes, InferCreationAttributes, Model} from "sequelize";

const {DBService} = require('../../services/db');
const {DataTypes} = require('sequelize')

const sequelize = DBService.postgres.sequelize

interface IDocument extends Model<InferAttributes<IDocument>, InferCreationAttributes<IDocument>> {
  id?: CreationOptional<number>;
  name?: string,
  path?: string,
}

const documentModel: IDocument = sequelize.define('document', {
  id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
  name: {type: DataTypes.STRING},
  path: {type: DataTypes.STRING, unique: true},
})

export {documentModel, IDocument}