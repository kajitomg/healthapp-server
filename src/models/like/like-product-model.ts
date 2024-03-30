import {CreationOptional, InferAttributes, InferCreationAttributes, Model} from "sequelize";

import {DBService} from '../../services/db';
import {DataTypes} from 'sequelize'

const sequelize = DBService.postgres.sequelize

interface ILikeProduct extends Model<InferAttributes<ILikeProduct>, InferCreationAttributes<ILikeProduct>> {
  id: CreationOptional<number>;
  likeId?: CreationOptional<number>;
  productId?: CreationOptional<number>;
}

const likeProductModel = sequelize.define<ILikeProduct>('like-product', {
  id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
})

export {likeProductModel, ILikeProduct}