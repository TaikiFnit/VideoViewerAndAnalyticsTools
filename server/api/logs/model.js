module.exports = class LogModel {
  constructor(databaseMapper) {
    this.databaseMapper = databaseMapper
  }

  async storeInteractionLog(type, time, movieId, tempId, userId) {}

  storePageTransitionLog({ path, isSsr, tempId, userId, host }) {
    this.databaseMapper.storePageTransitionLog(
      path,
      isSsr,
      tempId,
      userId,
      host
    )
  }
}
