import {productSpecificationModel} from "./product/product-specification-model";
import {productValueModel} from "./product/product-value-model";

const {userModel} = require('./user/user-model')
const {authDataModel} = require('./user/auth-data-model')
const {roleModel} = require('./user/role-model')
const {mailAuthModel} = require('./user/mail-auth-model')
const {tokenModel} = require('./user/token-model')
const {categoryModel} = require('./product/category-model')
const {productCategoryModel} = require('./product/product-category-model')
const {specificationModel} = require('./product/specification-model')
const {specificationValueModel} = require('./product/specification-value-model')
const {typeModel} = require('./product/type-model')
const {valueModel} = require('./product/value-model')
const {productImageModel} = require('./product/product-image-model');
const {productDocumentModel} = require('./product/product-document-model');
const {productModel} = require('./product/product-model');
const {imageModel} = require('./image/image-model');
const {documentModel} = require('./document/document-model');

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

categoryModel.hasOne(specificationModel)
specificationModel.belongsTo(categoryModel) // Связь категории с характеристикой, с ссылкой в характеристике

typeModel.hasMany(specificationModel)
specificationModel.belongsTo(typeModel) // Связь типа с характеристикой, с ссылкой в характеристике

productModel.belongsToMany(imageModel, {through: productImageModel})
imageModel.belongsToMany(productModel, {through: productImageModel}) // Связь продукта с изображением, с ссылкой в связывающей таблице

productModel.belongsToMany(documentModel, {through: productDocumentModel})
documentModel.belongsToMany(productModel, {through: productDocumentModel})// Связь продукта с документов, с ссылкой в связывающей таблице

specificationModel.belongsToMany(valueModel, {through: specificationValueModel})
valueModel.belongsToMany(specificationModel, {through: specificationValueModel}) // Связь характеристики с базовым значением, с ссылкой в связывающей таблице

productModel.belongsToMany(categoryModel, {through: productCategoryModel})
categoryModel.belongsToMany(productModel, {through: productCategoryModel}) // Связь продукта с категорией, с ссылкой в связывающей таблице

productModel.belongsToMany(specificationModel, {through: productSpecificationModel})
specificationModel.belongsToMany(productModel, {through: productSpecificationModel}) // Связь продукта с характеристикой, с ссылкой в связывающей таблице

productModel.belongsToMany(valueModel, {through: productValueModel})
valueModel.belongsToMany(productModel, {through: productValueModel}) // Связь продукта с значением, с ссылкой в связывающей таблице

export {
  userModel,
  authDataModel,
  roleModel,
  mailAuthModel,
  tokenModel,
  categoryModel,
  productModel,
  imageModel,
  documentModel,
  productValueModel,
  productSpecificationModel,
  productCategoryModel,
  specificationModel,
  specificationValueModel,
  typeModel,
  valueModel
}