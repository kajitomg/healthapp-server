import {CreationOptional, InferAttributes, InferCreationAttributes, Model} from "sequelize";

const {DBService} = require('../../services/db');
const {DataTypes} = require('sequelize')

const sequelize = DBService.postgres.sequelize

interface CategoryI extends Model<InferAttributes<CategoryI>, InferCreationAttributes<CategoryI>> {
  id: CreationOptional<number>;
  name: string,
}

const categoryModel: CategoryI = sequelize.define('category', {
  id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
  name: {type: DataTypes.STRING},
})

export {categoryModel, CategoryI}