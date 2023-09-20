import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from "sequelize";

const { DBService } = require('../services/db');

const sequalize = DBService.postgres.sequalize

interface TokenI extends Model<InferAttributes<TokenI>, InferCreationAttributes<TokenI>> {
	id: CreationOptional<number>;
	refresh: DataTypes.TextDataType,
	userId: CreationOptional<number>;
}
const tokenModel: TokenI = sequalize.define('token', {
	id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
	refresh: { type: DataTypes.STRING },
})

export { tokenModel, TokenI }