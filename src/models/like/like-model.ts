import {CreationOptional, InferAttributes, InferCreationAttributes, Model} from "sequelize";
import {ILikeProduct} from "./like-product-model";

import {DBService} from '../../services/db';
import {DataTypes} from 'sequelize'

const sequelize = DBService.postgres.sequelize

interface ILike extends Model<InferAttributes<ILike>, InferCreationAttributes<ILike>> {
  id: CreationOptional<number>;
  userId?: CreationOptional<number>;
  'like-product'?:ILikeProduct;
}

const likeModel = sequelize.define<ILike>('like', {
  id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
})

export {likeModel, ILike}