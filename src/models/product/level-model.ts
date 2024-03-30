import {CreationOptional, InferAttributes, InferCreationAttributes, Model} from "sequelize";

import {DBService} from '../../services/db';
import {DataTypes} from 'sequelize'

const sequelize = DBService.postgres.sequelize

interface ILevel extends Model<InferAttributes<ILevel>, InferCreationAttributes<ILevel>> {
  id: CreationOptional<number>;
  name: string,
}

const levelModel = sequelize.define<ILevel>('level', {
  id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
  name: {type: DataTypes.STRING},
})

export {levelModel, ILevel}