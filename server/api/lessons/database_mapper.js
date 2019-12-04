const Database = require('../../database')

module.exports = class LessonDatabaseMapper {
  constructor(database) {
    this.database = new Database()
  }

  async test() {
    const result = await this.database.execute('show tables;')
    return result
  }

  async fetchAllLessons() {
    const sql = 'select * from lessons'
    const result = await this.database.execute(sql)
    return result
  }

  async fetchLessonById(id) {
    const sql = 'select * from lessons where lessons.id = ?'
    const result = await this.database.execute(sql, [id])
    return result
  }
}
