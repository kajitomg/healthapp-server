import {CreationOptional, InferAttributes, InferCreationAttributes, Model} from "sequelize";

const {DBService} = require('../../services/db');
const {DataTypes} = require('sequelize')

const sequelize = DBService.postgres.sequelize

interface ICategory extends Model<InferAttributes<ICategory>, InferCreationAttributes<ICategory>> {
  id: CreationOptional<number>;
  name: string,
  levelId: CreationOptional<number>;
}

const categoryModel: ICategory = sequelize.define('category', {
  id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
  name: {type: DataTypes.STRING},
})

export {categoryModel, ICategory}