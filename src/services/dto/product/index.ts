class productDTO {
  public id?: number
  public name?: string
  public article?: string
  public price?: number
  public description?: number
  public discount?: string
  
  constructor(user) {
    this.id = user.id
    this.name = user.name
    this.article = user.article
    this.price = user.price
    this.description = user.description
    this.discount = user.discount
  }
}

export {productDTO}