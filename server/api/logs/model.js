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
}
