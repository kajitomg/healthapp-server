import {CreationOptional, InferAttributes, InferCreationAttributes, Model} from "sequelize";

import {DBService} from '../../services/db';
import {DataTypes} from 'sequelize'

const sequelize = DBService.postgres.sequelize

interface ICategoryChildren extends Model<InferAttributes<ICategoryChildren>, InferCreationAttributes<ICategoryChildren>> {
  id: CreationOptional<number>;
  parentId?: CreationOptional<number>;
  childrenId?: CreationOptional<number>;
}

const categoryChildrenModel = sequelize.define<ICategoryChildren>('category-children', {
  id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
})

export {categoryChildrenModel, ICategoryChildren}