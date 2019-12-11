module.exports = class LogModel {
  constructor(databaseMapper) {
    this.databaseMapper = databaseMapper
  }

  storeInteractionLog(videoId, time, userId, tempId, type) {
    this.databaseMapper.storeVideoPlayerInteractionLog(
      videoId,
      time,
      userId,
      tempId,
      type
    )
  }

  storePageTransitionLog(path, isSsr, tempId, userId, host) {
    this.databaseMapper.storePageTransitionLog(
      path,
      isSsr,
      tempId,
      userId,
      host
    )
  }

  async findLearningLog(userId, videoId) {
    const log = (
      await this.databaseMapper.findLearningRecord(userId, videoId)
    )[0]

    return log
  }

  storeLearningLog(userId, videoId, status) {
    this.databaseMapper.storeLearningRecord(userId, videoId, status)
  }

  storeFeedback(feedback, videoId, userId, tempId) {
    this.databaseMapper.storeFeedback(feedback, videoId, userId, tempId)
  }
}
