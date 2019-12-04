module.exports = class LessonModel {
  constructor(databaseMapper) {
    console.log('model constructed')
    this.databaseMapper = databaseMapper
  }

  async all() {
    const lessons = await this.databaseMapper.fetchAllLessons()
    return lessons
  }

  async find(id) {
    const lesson = await this.databaseMapper.fetchLessonById(id)
    return lesson[0]
  }

  async test() {
    console.log('model tested')
    const result = await this.databaseMapper.test()
    return result
  }
}
