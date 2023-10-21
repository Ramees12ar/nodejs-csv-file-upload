import dbConfig from "./db.config.mjs";
import mysql from "mysql2"
import Sequelize from 'sequelize'

// const { host, dbUser, dbPassword, database, dialect } = dbConfig;
// const connection = await mysql.createConnection({ host, user: dbUser, password: dbPassword });
// await connection.query(`CREATE DATABASE IF NOT EXISTS \`${database}\`;`);
const sequelize = new Sequelize(dbConfig.database, dbConfig.dbUser, dbConfig.dbPassword, {
  host: dbConfig.host,
  dialect: dbConfig.dialect,
  operatorsAliases: false,
});
// Check if the schema already exists, and create it if not
sequelize.query(`CREATE SCHEMA IF NOT EXISTS ${dbConfig.database};`)
  .then(() => {
    console.log(`Schema '${dbConfig.database}' created or already exists.`);
  })
  .catch((err) => {
    console.error('Error creating schema:', err);
  });
sequelize.sync().then(() => {
  console.log('connected to db');
}).catch(err => {
  console.error('Unable to connect to db', err);
})

export default sequelize;