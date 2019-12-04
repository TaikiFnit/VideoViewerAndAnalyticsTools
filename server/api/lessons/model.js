module.exports = class LessonModel {
  constructor(databaseMapper) {
    console.log('model constructed')
    this.databaseMapper = databaseMapper
  }

  async test() {
    console.log('model tested')
    const result = await this.databaseMapper.test()
    return result
  }
}
