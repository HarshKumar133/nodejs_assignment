const mysql = require('mysql2/promise');
const env = require('../config/env');

const poolOptions = {
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

const poolConfig = env.mysqlUrl
  ? { uri: env.mysqlUrl, ...poolOptions }
  : {
      host: env.dbHost,
      port: env.dbPort,
      user: env.dbUser,
      password: env.dbPassword,
      database: env.dbName,
      ...poolOptions
    };

const pool = mysql.createPool(poolConfig);

module.exports = pool;
