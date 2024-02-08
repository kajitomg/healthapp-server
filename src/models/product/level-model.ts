import {CreationOptional, InferAttributes, InferCreationAttributes, Model} from "sequelize";

const {DBService} = require('../../services/db');
const {DataTypes} = require('sequelize')

const sequelize = DBService.postgres.sequelize

interface ILevel extends Model<InferAttributes<ILevel>, InferCreationAttributes<ILevel>> {
  id: CreationOptional<number>;
  name: string,
}

const levelModel: ILevel = sequelize.define('level', {
  id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
  name: {type: DataTypes.STRING},
})

export {levelModel, ILevel}