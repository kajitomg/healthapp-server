import {CreationOptional, InferAttributes, InferCreationAttributes, Model} from "sequelize";

import {DBService} from '../../services/db';
import {DataTypes} from 'sequelize'

const sequelize = DBService.postgres.sequelize

interface ICategory extends Model<InferAttributes<ICategory>, InferCreationAttributes<ICategory>> {
  id: CreationOptional<number>,
  name: string,
  levelId?: CreationOptional<number>,
}

const categoryModel = sequelize.define<ICategory>('category', {
  id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
  name: {type: DataTypes.STRING}
})

export {categoryModel, ICategory}