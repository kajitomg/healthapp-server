import {CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model} from "sequelize";

const {DBService} = require('../../services/db');

const sequelize = DBService.postgres.sequelize



interface IToken extends Model<InferAttributes<IToken>, InferCreationAttributes<IToken>> {
  id: CreationOptional<number>;
  refresh: DataTypes.TextDataType,
  userId: CreationOptional<number>;
}

const tokenModel: IToken = sequelize.define('token', {
  id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
  refresh: {type: DataTypes.STRING(1000)},
})

export {tokenModel, IToken}