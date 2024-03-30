import {CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model} from "sequelize";

import {DBService} from '../../services/db';

const sequelize = DBService.postgres.sequelize



interface IToken extends Model<InferAttributes<IToken>, InferCreationAttributes<IToken>> {
  id: CreationOptional<number>;
  refresh: string,
  userId?: CreationOptional<number>;
}

const tokenModel = sequelize.define<IToken>('token', {
  id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
  refresh: {type: DataTypes.STRING(1000)},
})

export {tokenModel, IToken}