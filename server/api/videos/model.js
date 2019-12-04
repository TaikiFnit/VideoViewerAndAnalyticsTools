module.exports = class VideoModel {
  constructor(databaseMapper) {
    console.log('model constructed')
    this.databaseMapper = databaseMapper
  }

  async find(id) {
    const video = (await this.databaseMapper.fetchVideoById(id))[0]
    return { ...video }
  }
}
