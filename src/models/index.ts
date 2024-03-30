import {orderCustomerModel} from './order/order-customer-model';
import {likeProductModel} from './like/like-product-model';
import {cartProductModel} from './cart/cart-product-model';
import {categoryChildrenModel} from './product/category-children-model';
import {likeModel} from './like/like-model';
import {cartModel} from './cart/cart-model';
import {levelModel} from './product/level-model';
import {userModel} from './user/user-model'
import {authDataModel} from './user/auth-data-model'
import {roleModel} from './user/role-model'
import {mailAuthModel} from './user/mail-auth-model'
import {tokenModel} from './user/token-model'
import {categoryModel} from './product/category-model'
import {productCategoryModel} from './product/product-category-model'
import {specificationModel} from './product/specification-model'
import {specificationValueModel} from './product/specification-value-model'
import {typeModel} from './product/type-model'
import {valueModel} from './product/value-model'
import {productImageModel} from './product/product-image-model';
import {productDocumentModel} from './product/product-document-model';
import {productModel} from './product/product-model';
import {productSpecificationModel} from './product/product-specification-model';
import {imageModel} from './image/image-model';
import {documentModel} from './document/document-model';
import {orderModel} from './order/order-model';
import {orderProductModel} from './order/order-product-model';
import {statusModel} from './order/status-model';


//user
userModel.hasOne(authDataModel)
authDataModel.belongsTo(userModel)

roleModel.hasMany(userModel)
userModel.belongsTo(roleModel)

mailAuthModel.hasOne(authDataModel)
authDataModel.belongsTo(mailAuthModel)

userModel.hasOne(tokenModel)
tokenModel.belongsTo(userModel)

//product


levelModel.hasOne(categoryModel)
categoryModel.belongsTo(levelModel)

categoryModel.hasOne(specificationModel)
specificationModel.belongsTo(categoryModel) // Связь категории с характеристикой, с ссылкой в характеристике

categoryModel.belongsToMany(categoryModel, {through: categoryChildrenModel,foreignKey: 'childrenId', as:'parents'})
categoryModel.belongsToMany(categoryModel, {through: categoryChildrenModel,foreignKey:'parentId', as:'childrens'})

typeModel.hasMany(specificationModel)
specificationModel.belongsTo(typeModel) // Связь типа с характеристикой, с ссылкой в характеристике

productModel.belongsToMany(imageModel, {through: productImageModel})
imageModel.belongsToMany(productModel, {through: productImageModel}) // Связь продукта с изображением, с ссылкой в связывающей таблице

imageModel.hasOne(productModel )
productModel.belongsTo(imageModel) // Связь продукта с главным изображением, с ссылкой в продукте

productModel.belongsToMany(documentModel, {through: productDocumentModel})
documentModel.belongsToMany(productModel, {through: productDocumentModel})// Связь продукта с документов, с ссылкой в связывающей таблице

specificationModel.belongsToMany(valueModel, {through: specificationValueModel})
valueModel.belongsToMany(specificationModel, {through: specificationValueModel}) // Связь характеристики с базовым значением, с ссылкой в связывающей таблице

productModel.belongsToMany(categoryModel, {through: productCategoryModel})
categoryModel.belongsToMany(productModel, {through: productCategoryModel}) // Связь продукта с категорией, с ссылкой в связывающей таблице

productModel.belongsToMany(specificationModel, {through: productSpecificationModel})
specificationModel.belongsToMany(productModel, {through: productSpecificationModel}) // Связь продукта с характеристикой, с ссылкой в связывающей таблице

specificationModel.hasMany(productSpecificationModel)
productSpecificationModel.belongsTo(specificationModel)

//like

userModel.hasMany(likeModel)
likeModel.belongsTo(userModel)

likeModel.belongsToMany(productModel, {through: likeProductModel})
productModel.belongsToMany(likeModel, {through: likeProductModel})

productModel.hasMany(likeProductModel)
likeProductModel.belongsTo(productModel)

//cart

userModel.hasMany(cartModel)
cartModel.belongsTo(userModel)

cartModel.belongsToMany(productModel, {through: cartProductModel})
productModel.belongsToMany(cartModel, {through: cartProductModel})

productModel.hasMany(cartProductModel)
cartProductModel.belongsTo(productModel)

//order

orderModel.belongsToMany(productModel, {through: orderProductModel})
productModel.belongsToMany(orderModel, {through: orderProductModel})

userModel.belongsToMany(orderModel,{through:orderCustomerModel,foreignKey:'customerId', as:'userId'})
orderModel.belongsToMany(userModel,{through:orderCustomerModel})

statusModel.hasOne(orderModel)
orderModel.belongsTo(statusModel)

export default {
  userModel,
  authDataModel,
  roleModel,
  mailAuthModel,
  tokenModel,
  categoryModel,
  productModel,
  likeModel,
  cartModel,
  cartProductModel,
  likeProductModel,
  orderCustomerModel,
  levelModel,
  orderModel,
  statusModel,
  orderProductModel,
  imageModel,
  documentModel,
  productSpecificationModel,
  productCategoryModel,
  specificationModel,
  specificationValueModel,
  typeModel,
  valueModel
}