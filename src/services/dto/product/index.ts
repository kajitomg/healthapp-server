class productDTO {
  public id?: number
  public name?: string
  public article?: string
  public price?: number
  public description?: number
  public discount?: string
  public imageId?: number
  
  constructor(product) {
    this.id = product.id
    this.name = product.name
    this.article = product.article
    this.price = product.price
    this.description = product.description
    this.discount = product.discount
    this.imageId = product.imageId
  }
}

export {productDTO}