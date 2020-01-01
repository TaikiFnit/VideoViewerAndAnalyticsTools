module.exports = class AnalyticsModel {
  constructor(databaseMapper) {
    this.databaseMapper = databaseMapper
  }

  async getSections(sequenceId) {
    const sections = await this.databaseMapper.fetchSectionsBy(sequenceId)
    return sections
  }

  async storeSections(videoId, name, type, sections) {
    const sequenceId = await this.databaseMapper.storeSectionSequence(
      name,
      type,
      videoId
    )
    sections.forEach((section) => {
      this.databaseMapper.storeSection(videoId, sequenceId, section)
    })
  }

  async getSectionSequence(videoId) {
    const sectionSequences = await this.databaseMapper.fetchSectionSequenceBy(
      videoId,
      'sections'
    )

    const visualTransitionSequences = await this.databaseMapper.fetchSectionSequenceBy(
      videoId,
      'visualTransitions'
    )

    return {
      sectionSequences,
      visualTransitionSequences
    }
  }

  async getSectionSequences() {
    const sectionSequences = await this.databaseMapper.fetchSectionSequencesOf(
      'sections'
    )
    // const visualTransitionSequences = await this.databaseMapper.fetchSectionSequencesOf()

    return sectionSequences
  }

  async getTargetUsers(videoId) {
    const users = await this.databaseMapper.fetchUsersForAnalytics(videoId)
    return users
  }

  async startAnalyze(
    videoId,
    sectionSequenceId,
    visualTransitionSequenceId,
    selectedUsers,
    removeMargin,
    analyzeName
  ) {
    // 1. 画面遷移のsectionを抽出
    // input: visualTransitionSequenceId
    // output: [SECTION]
    const visualTransitions = await this.databaseMapper.fetchSectionsBy(
      visualTransitionSequenceId
    )

    // 2. 画面遷移をfilteringしたinteraction logs (scoped with selected user)
    // input: videoId, [userIds], [SECTION(timeTo, timeFrom), removeMargin]
    const interactionLogs = await this.databaseMapper.extractFilteredVideoPlayerInteractionLogs(
      videoId,
      selectedUsers,
      visualTransitions,
      removeMargin
    )

    // 分析結果保存: 分析条件の保存
    const analyticsResultId = await this.databaseMapper.storeAnalyticsResult(
      videoId,
      sectionSequenceId,
      visualTransitionSequenceId,
      removeMargin,
      analyzeName
    )

    // 分析結果保存: 分析対象ユーザーの保存
    Promise.all(
      selectedUsers.map(async (userId) => {
        const resultId = await this.databaseMapper.storeAnalyticsResultTargetUser(
          analyticsResultId,
          userId
        )
        return resultId
      })
    )

    // 分析結果保存: 分析結果(フィルターされたlog)の保存
    Promise.all(
      interactionLogs.map(async (interactionLog) => {
        const resultId = await this.databaseMapper.storeAnalyticsResultFilteredInteractionLog(
          analyticsResultId,
          interactionLog.id
        )
        return resultId
      })
    )

    // 分析結果保存: 分析Core(フィルターされたlogのcount)の実行&結果の保存
    // do each sections
    const sections = await this.databaseMapper.fetchSectionsBy(
      sectionSequenceId
    )

    Promise.all(
      sections.map(async (section) => {
        const resultId = await this.databaseMapper.storeAnalyticsResultsAggregation(
          analyticsResultId,
          section.id
        )
        return resultId
      })
    )

    return analyticsResultId
  }

  async getResult(resultId) {
    const analyticsResult = (
      await this.databaseMapper.fetchAnalyticsResult(resultId)
    )[0]

    const targetUsers = await this.databaseMapper.fetchAnalyticsResultTargetUser(
      resultId
    )
    const filteredInteractionLogs = await this.databaseMapper.fetchAnalyticsResultFilteredInteractionLog(
      resultId
    )
    const visualTransitionSequence = (
      await this.databaseMapper.findSectionSequence(
        analyticsResult.visual_transition_sequence_id
      )
    )[0]
    const sectionSequence = (
      await this.databaseMapper.findSectionSequence(
        analyticsResult.section_sequence_id
      )
    )[0]
    const visualTransitions = await this.databaseMapper.fetchSectionsBy(
      visualTransitionSequence.id
    )
    const sections = await this.databaseMapper.fetchSectionsBy(
      sectionSequence.id
    )
    const aggregation = await this.databaseMapper.fetchAnalyticsResultAggregationBy(
      analyticsResult.id
    )
    const aggregationSum = aggregation.reduce(
      (prev, current, index, array) => ({
        log_count: prev.log_count + current.log_count
      })
    ).log_count
    const video = (
      await this.databaseMapper.fetchVideoById(analyticsResult.video_id)
    )[0]

    return {
      ...analyticsResult,
      targetUsers,
      filteredInteractionLogs,
      visualTransitionSequence,
      sectionSequence,
      visualTransitions,
      sections,
      aggregation,
      aggregationSum,
      video
    }
  }
}
