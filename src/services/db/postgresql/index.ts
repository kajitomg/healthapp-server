require('dotenv').config()
import * as pg from 'pg'
import {Sequelize} from 'sequelize';

const DB = new Sequelize(
  process.env.DB_PG_NAME,
  process.env.DB_PG_USER,
  process.env.DB_PG_PASSWORD,
  {
    dialect:'postgres',
    dialectModule: pg,
    host: process.env.DB_PG_HOST,
    port: +(process.env.DB_PG_PORT || 5432),
  }
)

class Postgresql {
  static sequelize  = DB
  
  static async start() {
    await DB.authenticate()
    await DB.sync()
  }
}

export {Postgresql}