import {CreationOptional, InferAttributes, InferCreationAttributes, Model} from "sequelize";

const {DBService} = require('../../services/db');
const {DataTypes} = require('sequelize')

const sequelize = DBService.postgres.sequelize

interface ICategoryChildren extends Model<InferAttributes<ICategoryChildren>, InferCreationAttributes<ICategoryChildren>> {
  id: CreationOptional<number>;
  parentId: CreationOptional<number>;
  childrenId: CreationOptional<number>;
}

const categoryChildrenModel: ICategoryChildren = sequelize.define('category-children', {
  id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
})

export {categoryChildrenModel, ICategoryChildren}