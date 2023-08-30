const {Postgresql} = require('./postgresql')

class DBService {
  static postgres = Postgresql
}

export {DBService}