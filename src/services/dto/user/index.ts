class userDTO {
  public id
  public name
  public email
  public roleId
  
  constructor(user) {
    this.id = user.id
    this.name = user.name
    this.email = user.email
    this.roleId = user.roleId
  }
}

export {userDTO}