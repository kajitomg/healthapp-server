import {CreationOptional, InferAttributes, InferCreationAttributes, Model} from "sequelize";

import {DBService} from '../../services/db';
import {DataTypes} from 'sequelize'

const sequelize = DBService.postgres.sequelize

interface IUser extends Model<InferAttributes<IUser>, InferCreationAttributes<IUser>> {
  id: CreationOptional<number>,
  name: string,
  email: string,
  password: string,
  phonenumber: string,
  roleId?: number,
}

const userModel = sequelize.define<IUser>('user', {
  id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
  name: {type: DataTypes.STRING},
  email: {
    type: DataTypes.STRING, unique: true, allowNull: false, validate: {
      isEmail: true
    }
  },
  phonenumber: {
    type: DataTypes.STRING, unique: true, validate: {
      is: /^\+?[78][\s]?[-\(]?[\s]?\d{3}?\)?[\s]?-?\d{3}?-?\d{2}?-?\d{2}?$/
    }
  },
  password: {type: DataTypes.STRING, allowNull: false}
})

export {userModel, IUser}