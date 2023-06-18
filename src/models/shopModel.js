import { DataTypes } from "sequelize"
import { getInstance } from '../../dbs/setup.js'
const sequelize = getInstance()

const schema = {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  address: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  telephone: {
    type: DataTypes.STRING,
    allowNull: false,
  }
}

const Shop = sequelize.define('shop',schema,{
  createdAt: false,
  updatedAt:false,
  freezeTableName:true
})

export {
  Shop,
  schema
}