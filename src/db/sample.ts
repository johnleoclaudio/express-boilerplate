import { Model, DataTypes } from "sequelize";
import sequelize from "./index";

class Sample extends Model {}

Sample.init(
  {
    ownerId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    ownerType: {
      type: DataTypes.STRING,
      allowNull: false
    },
    password: {
      type: DataTypes.TEXT,
      allowNull: false
    }
  },
  { sequelize, underscored: true }
);

export default Sample;
