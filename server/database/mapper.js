const Database = require('./index')

module.exports = class LessonDatabaseMapper {
  constructor() {
    this.database = new Database()
  }

  async test() {
    const result = await this.database.execute('show tables;')
    return result
  }

  async fetchUserByName(username) {
    const sql = 'select * from users where users.name = ?'
    const result = await this.database.execute(sql, [username])
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

  async fetchLessonBySlug(slug) {
    const sql = 'select * from lessons where lessons.slug = ?'
    const result = await this.database.execute(sql, [slug])
    return result
  }

  async fetchVideosByLessonId(lessonId) {
    const sql = 'select * from lesson_videos where lesson_id = ?'
    const result = await this.database.execute(sql, [lessonId])
    return result
  }

  async fetchVideoById(id) {
    const sql = 'select * from lesson_videos where lesson_videos.id = ?'
    const result = await this.database.execute(sql, [id])
    return result
  }

  async fetchVideoByLessonSlugAndOrder(slug, order) {
    const sql = `
      select
        lesson_videos.*
      from
        lesson_videos
      inner join
        lessons on lessons.id = lesson_videos.lesson_id
      where
        lessons.slug = ? and
        lesson_videos.order = ?`

    const result = await this.database.execute(sql, [slug, order])
    return result
  }

  async storePageTransitionLog(path, isSsr, tempId, userId, host) {
    const sql = `
      insert into
        page_transition_logs(path, is_ssr, temp_id, user_id, host, created_at)
      values
        (?, ?, ?, ?, ?, now())`

    const result = await this.database.execute(sql, [
      path,
      isSsr,
      tempId,
      userId,
      host
    ])

    return result
  }
}
