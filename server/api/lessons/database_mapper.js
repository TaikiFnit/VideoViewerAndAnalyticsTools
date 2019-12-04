const Database = require('../../database')

module.exports = class LessonDatabaseMapper {
  constructor(database) {
    this.database = new Database()
  }

  async test() {
    const result = await this.database.execute('show tables;')
    return result
  }
}
