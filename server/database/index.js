const mysql = require('mysql2/promise')
require('dotenv').config()
const config = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: 3306
  // ssl: true
}

module.exports = class Database {
  constructor() {
    this.config = config
  }

  async execute(sql, placeholder = []) {
    const connection = await mysql.createConnection(this.config)
    const [rows] = await connection.execute(sql, placeholder)
    await connection.end()

    return rows
  }
}
