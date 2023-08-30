require('dotenv').config()
const {Sequelize} = require('sequelize');

const DB = new Sequelize(
  process.env.DB_PG_NAME,
  process.env.DB_PG_USER,
  process.env.DB_PG_PASSWORD,
  {
    dialect:'postgres',
    host:process.env.DB_PG_HOST,
    port:+process.env.DB_PG_PORT
  }
  
)

class Postgresql {
  static sequalize = DB
  static async start() {
    await DB.authenticate()
    await DB.sync()
  }
}
export {Postgresql}