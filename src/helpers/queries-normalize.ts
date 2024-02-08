import {Op} from "sequelize"
import {DBService} from "../services/db"

export default function queriesNormalize(queries) {
  const sequelize = DBService.postgres.sequelize
  
  const offset = queries.page ? queries?.page * queries?.limit - queries?.limit: undefined
  const limit = queries.limit ? queries?.limit : undefined
  const order = queries?.sort ? Object.entries(queries?.sort) : []
  const searched = {}
  
  if (!queries?.search) {
    return {searched, offset, limit, order}
  }
  
  const searchKeys = Object.keys(queries?.search)
  
  searchKeys.map(key => {
    searched[key] = {[Op.like]: `%${queries?.search[key]}%`}
    if (key === 'id') {
      searched[key] = {
        [Op.or]: [
          sequelize.where(
            sequelize.cast(sequelize.col('user.id'), 'varchar'),
            {[Op.like]: `%${queries?.search[key]}%`},
          ),
        ]
      }
    }
  })
  
  return {searched, offset, limit, order}
}