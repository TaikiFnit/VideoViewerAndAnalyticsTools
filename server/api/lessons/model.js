module.exports = class LessonModel {
  constructor(databaseMapper) {
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
}
