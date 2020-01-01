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
    const sql = `
      select
        lesson_videos.*,
        lessons.title as lessonTitle,
        lessons.description as lessonDescription
      from
        lesson_videos
      inner join
        lessons on lessons.id = lesson_videos.lesson_id
      where
        lesson_videos.id = ?`
    const result = await this.database.execute(sql, [id])
    return result
  }

  async fetchVideosByIds(ids) {
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
        lessons on lessons.id = lesson_videos.lesson_id
      where
        lesson_videos.id in (${ids.join(',')});`
    const result = await this.database.execute(sql)
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

  async extractFilteredVideoPlayerInteractionLogs(
    videoId,
    userIds,
    sections,
    removeMargin
  ) {
    const userInteractionLogExtractionSql = userIds
      .map(
        (userId) => `
      select
        video_player_interaction_logs.*
      from
        video_player_interaction_logs
      where
        video_player_interaction_logs.user_id = ${userId} and
        video_player_interaction_logs.video_id = ${videoId} and
        video_player_interaction_logs.type = "START" and
        video_player_interaction_logs.created_at < coalesce(
          (select
            learning_records.created_at
          from
            learning_records
          where
            learning_records.user_id = ${userId} and
            learning_records.status = 1 and
            learning_records.lesson_video_id = ${videoId}
          order by
            learning_records.created_at desc
          limit
            1), now())`
      )
      .join(' union ')

    const filteringLogSql = sections
      .map(
        (section) =>
          ` and usersInteractionLogs.video_time not between ${section.timeFrom -
            removeMargin} and ${section.timeFrom + removeMargin}`
      )
      .join(' ')

    const sql = `
      select
        *
      from
        (${userInteractionLogExtractionSql}) as usersInteractionLogs
      where
        usersInteractionLogs.type = "START"
        ${filteringLogSql}
    `

    console.log('finally we can construct completed sql')
    console.log(sql)

    const result = await this.database.execute(sql, [videoId])
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

  async storeSectionSequence(name, type, videoId) {
    const sql = `
      insert into analytics_section_sequence(name, type, video_id, created_at) values(?, ?, ?, now());
    `

    const result = await this.database.execute(sql, [name, type, videoId])

    return result.insertId
  }

  async fetchSectionsBy(sequenceId) {
    const sql = `
      select
        analytics_sections.*
      from
        analytics_sections
      where
        analytics_sections.section_sequence_id = ?
      order by
        analytics_sections.time_order asc;
    `

    const result = await this.database.execute(sql, [sequenceId])

    return result
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

  async findSectionSequence(id) {
    const sql = `
      select
        analytics_section_sequence.*
      from
        analytics_section_sequence
      where
        analytics_section_sequence.id = ?;
    `

    const result = await this.database.execute(sql, [id])
    return result
  }

  async fetchSectionSequencesOf(type) {
    const sql = `
      select
        analytics_section_sequence.*
      from
        analytics_section_sequence
      where
        analytics_section_sequence.type = ?;`

    const result = await this.database.execute(sql, [type])

    return result
  }

  async fetchSectionSequenceBy(videoId, type) {
    const sql = `
      select
        analytics_section_sequence.*
      from
        analytics_section_sequence
      where
        analytics_section_sequence.video_id = ? and
        analytics_section_sequence.type = ?`

    const result = await this.database.execute(sql, [videoId, type])

    return result
  }

  async fetchUsersForAnalytics(videoId) {
    const sql = `
      select
        users.id,
        users.name,
        users.created_at,
        count(video_player_interaction_logs.user_id) as countInteractions,
        max(learning_records.status) as learningCompleted
      from
        video_player_interaction_logs
      inner join
        users on video_player_interaction_logs.user_id = users.id
      left join
        learning_records on video_player_interaction_logs.user_id = learning_records.user_id and learning_records.lesson_video_id = video_player_interaction_logs.video_id
      where
        video_player_interaction_logs.video_id = ?
      group by
        video_player_interaction_logs.user_id;
    `

    const result = await this.database.execute(sql, [videoId])

    return result
  }

  async storeAnalyticsResult(
    videoId,
    sectionSequenceId,
    visualTransitionSequenceId,
    removeMargin,
    analyzeName
  ) {
    const sql = `
      insert into
        analytics_results(video_id, section_sequence_id, visual_transition_sequence_id, created_at, remove_margin, name)
      values
        (?, ?, ?, now(), ?, ?);
    `

    const result = await this.database.execute(sql, [
      videoId,
      sectionSequenceId,
      visualTransitionSequenceId,
      removeMargin,
      analyzeName
    ])

    return result.insertId
  }

  async storeAnalyticsResultTargetUser(analyticsResultId, userId) {
    const sql = `
      insert into
        analytics_result_target_users(analytics_result_id, user_id, created_at)
      values
        (?, ?, now());
    `

    const result = await this.database.execute(sql, [analyticsResultId, userId])

    return result.insertId
  }

  async storeAnalyticsResultFilteredInteractionLog(
    analyticsResultId,
    interactionLogId
  ) {
    const sql = `
      insert into
        analytics_result_filtered_interaction_logs(analytics_result_id, video_player_interaction_log_id, created_at)
      values
        (?, ?, now());
    `

    const result = await this.database.execute(sql, [
      analyticsResultId,
      interactionLogId
    ])

    return result.insertId
  }

  async fetchAnalyticsResults() {
    const sql = `
      select
        analytics_results.*,
        lesson_videos.title as videoTitle,
        lesson_videos.order,
        lessons.title as lessonTitle
      from
        analytics_results
      inner join
        lesson_videos on lesson_videos.id = analytics_results.video_id
      inner join
        lessons on lessons.id = lesson_videos.lesson_id
      order by
        analytics_results.created_at desc
    `

    const result = await this.database.execute(sql)
    return result
  }

  async fetchAnalyticsResult(resultId) {
    const sql = `
      select
        *
      from
        analytics_results
      where
        analytics_results.id = ?;
    `

    const result = await this.database.execute(sql, [resultId])
    return result
  }

  async fetchAnalyticsResultTargetUser(resultId) {
    const sql = `
      select
        users.id,
        users.name
      from
        analytics_result_target_users
      inner join
        users on users.id = analytics_result_target_users.user_id
      where
        analytics_result_target_users.analytics_result_id = ?;
    `

    const result = await this.database.execute(sql, [resultId])
    return result
  }

  async fetchAnalyticsResultFilteredInteractionLog(resultId) {
    const sql = `
      select
        video_player_interaction_logs.*
      from
        analytics_result_filtered_interaction_logs
      inner join
        video_player_interaction_logs on
        video_player_interaction_logs.id = analytics_result_filtered_interaction_logs.video_player_interaction_log_id
      where
        analytics_result_filtered_interaction_logs.analytics_result_id = ?;
    `

    const result = await this.database.execute(sql, [resultId])
    return result
  }

  async storeAnalyticsResultsAggregation(analyticsResultId, sectionId) {
    const sql = `
      insert into
        analytics_results_aggregation(analytics_result_id, analytics_section_id, log_count, created_at)
      values
        (?, ?,
        (
          select
            count(*) as logCount
          from
            (
              select
                video_player_interaction_logs.*
              from
                analytics_result_filtered_interaction_logs
              inner join
                video_player_interaction_logs on
                video_player_interaction_logs.id = analytics_result_filtered_interaction_logs.video_player_interaction_log_id
              where
                analytics_result_filtered_interaction_logs.analytics_result_id = ?) as filteredInteractionLogs,
                (
                  select
                    analytics_sections.*
                  from
                    analytics_sections
                  where
                    analytics_sections.id = ?
            ) as targetSection
          where
            filteredInteractionLogs.video_time between targetSection.timeFrom and targetSection.timeTo
        )
        , now())`

    const result = await this.database.execute(sql, [
      analyticsResultId,
      sectionId,
      analyticsResultId,
      sectionId
    ])

    return result.insertId
  }

  async fetchAnalyticsResultAggregationBy(analyticsResultId) {
    const sql = `
      select
        analytics_results_aggregation.id,
        analytics_results_aggregation.log_count,
        analytics_results_aggregation.created_at,
        analytics_sections.id as sectionId,
        analytics_sections.name,
        analytics_sections.timeFrom,
        analytics_sections.timeTo,
        analytics_sections.time_order
      from
        analytics_results_aggregation
      inner join
        analytics_sections on
        analytics_sections.id = analytics_results_aggregation.analytics_section_id
      where
        analytics_results_aggregation.analytics_result_id = ?
      order by
        analytics_sections.time_order;
    `

    const result = await this.database.execute(sql, [analyticsResultId])
    return result
  }
}
