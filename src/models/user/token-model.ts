import {CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model} from "sequelize";

const {DBService} = require('../../services/db');

const sequelize = DBService.postgres.sequelize

interface TokenI extends Model<InferAttributes<TokenI>, InferCreationAttributes<TokenI>> {
  id: CreationOptional<number>;
  refresh: DataTypes.TextDataType,
  userId: CreationOptional<number>;
}

const tokenModel: TokenI = sequelize.define('token', {
  id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
  refresh: {type: DataTypes.STRING},
})

export {tokenModel, TokenI}