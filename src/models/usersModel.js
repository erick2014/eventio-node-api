import { DataTypes } from "sequelize";
import { getInstance } from "../../dbs/setup.js";
const sequelize = getInstance();

const schema = {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
};

const Users = sequelize.define("users", schema, {
  tableName: "users",
  createdAt: false,
  updatedAt: false,
  freezeTableName: true,
});

export { Users, schema };
