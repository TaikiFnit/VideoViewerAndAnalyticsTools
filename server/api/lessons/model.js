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
    const lesson = (await this.databaseMapper.fetchLessonById(id))[0]
    const videos = await this.databaseMapper.fetchVideosByLessonId(lesson.id)
    return { ...lesson, videos }
  }

  async findBySlug(slug) {
    const lesson = (await this.databaseMapper.fetchLessonBySlug(slug))[0]
    const videos = await this.databaseMapper.fetchVideosByLessonId(lesson.id)
    return { ...lesson, videos }
  }

  async findVideoByOrder(slug, order) {
    const video = (
      await this.databaseMapper.fetchVideoByLessonSlugAndOrder(slug, order)
    )[0]

    return video
  }

  async test() {
    console.log('model tested')
    const result = await this.databaseMapper.test()
    return result
  }
}
