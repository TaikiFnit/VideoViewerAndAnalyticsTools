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

  async fetchAllVideos() {
    const sql = `
      select
        lesson_videos.id,
        lesson_videos.youtube_id,
        lesson_videos.title,
        lesson_videos.description,
        lesson_videos.summary,
        lesson_videos.order,
        lessons.id as LessonId,
        lessons.title as lessonTitle,
        lessons.description as lessonDescription,
        lessons.summary as lessonSummary,
        lessons.slug
      from
        lesson_videos
      inner join
        lessons on lessons.id = lesson_videos.lesson_id;`

    const result = await this.database.execute(sql)
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

  async storeVideoPlayerInteractionLog(
    videoId,
    videoTime,
    userId,
    tempId,
    type
  ) {
    const sql = `insert into video_player_interaction_logs(video_id, video_time, user_id, temp_id, type, created_at) values(?, ?, ?, ?, ?, now())`
    const result = await this.database.execute(sql, [
      videoId,
      videoTime,
      userId,
      tempId,
      type
    ])
    return result
  }

  async findLearningRecord(userId, videoId) {
    const sql = `
      select
        *
      from
        learning_records
      where
        learning_records.user_id = ? and learning_records.lesson_video_id = ?
      order by
        learning_records.created_at desc
      limit
        1`

    const result = await this.database.execute(sql, [userId, videoId])
    return result
  }

  async storeLearningRecord(userId, videoId, status) {
    const sql = `
      insert into
        learning_records(user_id, lesson_video_id, status, created_at)
      values
        (?, ?, ?, now())`

    const result = await this.database.execute(sql, [userId, videoId, status])
    return result
  }

  async storeFeedback(feedback, videoId, userId, tempId) {
    const sql = `
      insert into
        video_feedbacks(feedback, video_id, user_id, temp_id, created_at)
      values
        (?, ?, ?, ?, now());`

    const result = await this.database.execute(sql, [
      feedback,
      videoId,
      userId,
      tempId
    ])
    return result
  }

  async storeSectionSequence(name, type) {
    const sql = `
      insert into analytics_section_sequence(name, type, created_at) values(?, ?, now());
    `

    const result = await this.database.execute(sql, [name, type])

    console.log(result)

    return result.insertId
  }

  async storeSection(videoId, sequenceId, section) {
    const sql = `
      insert into analytics_sections(video_id, section_sequence_id, timeTo, timeFrom, name, time_order, created_at) values(?, ?, ?, ?, ?, ?, now());
    `

    const result = await this.database.execute(sql, [
      videoId,
      sequenceId,
      section.timeTo,
      section.timeFrom,
      section.name,
      section.time_order
    ])

    return result
  }
}
