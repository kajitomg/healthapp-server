import {CreationOptional, InferAttributes, InferCreationAttributes, Model} from "sequelize";

import {DBService} from '../../services/db';
import {DataTypes} from 'sequelize'
import {levelModel} from "./level-model";

const sequelize = DBService.postgres.sequelize

interface ICategory extends Model<InferAttributes<ICategory>, InferCreationAttributes<ICategory>> {
  id: CreationOptional<number>;
  name: string,
  levelId: CreationOptional<number>;
}

const categoryModel = sequelize.define<ICategory>('category', {
  id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
  name: {type: DataTypes.STRING},
  levelId: {
    type: DataTypes.INTEGER,
    references: {
      model: levelModel,
      key: 'id'
    }
  }
})

export {categoryModel, ICategory}