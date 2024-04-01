import {CreationOptional, InferAttributes, InferCreationAttributes, Model} from "sequelize";
import {ICartProduct} from "../cart/cart-product-model";
import {ILikeProduct} from "../like/like-product-model";
import {ICart} from "../cart/cart-model";
import {ILike} from "../like/like-model";

import {DBService} from '../../services/db';
import {DataTypes} from 'sequelize'
import {imageService} from "../../services/image";
import {documentService} from "../../services/document";
import {specificationService} from "../../services/specification";
import {valueService} from "../../services/value";
import {IImage} from "../image/image-model";
import {IDocument} from "../document/document-model";
import {ISpecification} from "./specification-model";
import {IValue} from "./value-model";

const sequelize = DBService.postgres.sequelize

interface IProduct extends Model<InferAttributes<IProduct>, InferCreationAttributes<IProduct>> {
  id?: CreationOptional<number>;
  name?: string,
  article?: string,
  price?: number,
  discount?: number,
  description?: string,
  imageId?: CreationOptional<number>,
  count?: number,
  'cart-product'?:ICartProduct,
  'like-product'?:ILikeProduct,
  carts?:ICart[],
  likes?:ILike[],
  images?:IImage[],
  documents?:IDocument[],
  specifications?:ISpecification[],
  values?:IValue[],
}

const productModel = sequelize.define<IProduct>('product', {
  id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
  name: {type: DataTypes.STRING},
  article: {type: DataTypes.STRING},
  price: {type: DataTypes.INTEGER},
  discount: {type: DataTypes.INTEGER},
  description: {type: DataTypes.STRING(500)},
  count: {type:DataTypes.INTEGER}
})

export {productModel, IProduct}