import { Sequelize } from "sequelize";

const sequelize = new Sequelize("product_management", "root", "", {
  host: "localhost",
  dialect: "mysql",
});

export default sequelize;
