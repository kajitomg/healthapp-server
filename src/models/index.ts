const {orderCustomerModel} =  require('./order/order-customer-model');
const {likeProductModel} = require('./like/like-product-model');
const {cartProductModel} = require('./cart/cart-product-model');
const {categoryChildrenModel} = require('./product/category-children-model');
const {likeModel} = require('./like/like-model');
const {cartModel} = require('./cart/cart-model');
const {levelModel} = require('./product/level-model');
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
const {productSpecificationModel} = require('./product/product-specification-model');
const {imageModel} = require('./image/image-model');
const {documentModel} = require('./document/document-model');
const {orderModel} = require('./order/order-model');
const {orderProductModel} = require('./order/order-product-model');
const {statusModel} = require('./order/status-model');


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

export {
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