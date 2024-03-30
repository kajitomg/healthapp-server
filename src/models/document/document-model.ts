import {CreationOptional, InferAttributes, InferCreationAttributes, Model} from "sequelize";

import {DBService} from '../../services/db';
import {DataTypes} from 'sequelize'

const sequelize = DBService.postgres.sequelize

interface IDocument extends Model<InferAttributes<IDocument>, InferCreationAttributes<IDocument>> {
  id?: CreationOptional<number>;
  name?: string,
  path?: string,
}

const documentModel = sequelize.define<IDocument>('document', {
  id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
  name: {type: DataTypes.STRING},
  path: {type: DataTypes.STRING, unique: true},
})

export {documentModel, IDocument}