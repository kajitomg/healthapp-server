class tokenDTO {
  public id
  public refreshToken
  public userId
  
  constructor(token) {
    this.id = token.id
    this.refreshToken = token.refreshToken
    this.userId = token.userId
  }
}

class tokenDTOTransfer {
  public refreshToken
  public accessToken
  
  constructor(token) {
    this.accessToken = token.accessToken
    this.refreshToken = token.refreshToken
  }
}